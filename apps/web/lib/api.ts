import type {
  AuthResponse,
  ChangePasswordRequest,
  CreateTrackRequest,
  CurrentWeek,
  LoginRequest,
  Track,
  UpdateProfileRequest,
  UpdateTaskStatusRequest,
  UpdateTrackRequest,
  UserProfile,
} from '@cairn/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';
const ACCESS_KEY = 'cairn.access';
const REFRESH_KEY = 'cairn.refresh';

export const tokens = {
  access: () => localStorage.getItem(ACCESS_KEY),
  refresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** fetch wrapper: anexa o Bearer e, em 401, tenta um refresh antes de desistir. */
async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const access = tokens.access();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401 && retry && tokens.refresh()) {
    if (await tryRefresh()) {
      return request<T>(path, init, false);
    }
    tokens.clear();
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(res.status, body.message ?? res.statusText);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokens.refresh();
  if (!refreshToken) return false;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as AuthResponse;
  tokens.set(data.tokens.accessToken, data.tokens.refreshToken);
  return true;
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }, false);
  tokens.set(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/auth/logout', { method: 'POST' }, false);
  } catch {
    // ignora — vamos limpar os tokens de qualquer forma
  }
  tokens.clear();
}

export function getCurrentWeek(): Promise<CurrentWeek> {
  return request<CurrentWeek>('/current-week');
}

export function updateTaskStatus(taskId: string, body: UpdateTaskStatusRequest): Promise<CurrentWeek> {
  return request<CurrentWeek>(`/current-week/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ── Trilhas (Fatia 3a) ────────────────────────────────────────────────────────
export function getTracks(): Promise<Track[]> {
  return request<Track[]>('/tracks');
}

export function createTrack(body: CreateTrackRequest): Promise<Track> {
  return request<Track>('/tracks', { method: 'POST', body: JSON.stringify(body) });
}

export function updateTrack(id: string, body: UpdateTrackRequest): Promise<Track> {
  return request<Track>(`/tracks/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteTrack(id: string): Promise<void> {
  return request<void>(`/tracks/${id}`, { method: 'DELETE' });
}

// ── Perfil / Settings (Fatia 3) ───────────────────────────────────────────────
export function getProfile(): Promise<UserProfile> {
  return request<UserProfile>('/me');
}

export function updateProfile(body: UpdateProfileRequest): Promise<UserProfile> {
  return request<UserProfile>('/me', { method: 'PATCH', body: JSON.stringify(body) });
}

export function changePassword(body: ChangePasswordRequest): Promise<void> {
  return request<void>('/me/password', { method: 'POST', body: JSON.stringify(body) });
}
