/** Body of POST /auth/register. */
export interface RegisterRequest {
  email: string;
  password: string;
}

/** Body of POST /auth/login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Body of POST /auth/refresh. */
export interface RefreshRequest {
  refreshToken: string;
}

/** Token pair issued by auth (short access + long refresh). */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Public view of the user — never exposes the password hash. */
export interface PublicUser {
  id: string;
  email: string;
}

/** Response of register/login/refresh. */
export interface AuthResponse {
  user: PublicUser;
  tokens: AuthTokens;
}
