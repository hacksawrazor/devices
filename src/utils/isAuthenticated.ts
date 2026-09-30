export interface AuthenticatedUser {
  email?: string | null;
}

export function isAuthenticated(user: AuthenticatedUser | null | undefined): boolean {
  return Boolean(user?.email);
}
