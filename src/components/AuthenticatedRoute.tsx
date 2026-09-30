import type { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, type AuthenticatedUser } from '../utils/isAuthenticated';

interface AuthenticatedRouteProps {
  loading: boolean;
  user: AuthenticatedUser | null;
  children: ReactNode;
}

export default function AuthenticatedRoute({ loading, user, children }: AuthenticatedRouteProps) {
  if (loading) {
    return (
      <Box role="status" aria-label="Checking sign-in status" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return isAuthenticated(user) ? children : <Navigate to="/" replace />;
}
