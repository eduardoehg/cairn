/** Full account view (GET /me). */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  /** Weekly available time (hours) — the budget week generation must respect. */
  weeklyBudgetHours: number;
}

/** Body of PATCH /me. */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  weeklyBudgetHours?: number;
}

/** Body of POST /me/password. */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
