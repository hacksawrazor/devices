import type { AuthenticatedUser } from '../src/utils/isAuthenticated';
import { getRuntimeEnvironment } from '../src/config/runtimeEnvironment';

export function isDevelopmentAuthEnabled(): boolean {
  return getRuntimeEnvironment().isDevelopment;
}

export function getDevelopmentUser(): AuthenticatedUser {
  return { email: getRuntimeEnvironment().devAuthEmail || 'developer@local.test' };
}