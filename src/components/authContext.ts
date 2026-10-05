import { createContext, useContext } from 'react';
import type { AuthenticatedUser } from '../utils/isAuthenticated';

export interface AuthContextValue {
  userInfo: AuthenticatedUser | null;
  authLoading: boolean;
  developmentAuthEnabled: boolean;
  setUserInfo: (user: AuthenticatedUser | null) => void;
  onDevSignIn?: () => void;
  onDevSignOut?: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  userInfo: null,
  authLoading: false,
  developmentAuthEnabled: false,
  setUserInfo: () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}
