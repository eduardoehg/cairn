/** Payload signed in the JWTs (access and refresh). */
export interface JwtPayload {
  /** user id. */
  sub: string;
  email: string;
  /** unique token id — guarantees uniqueness across issuances (refresh rotation). */
  jti?: string;
}
