import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/hooks/auth/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isAccessTokenExpired } = useAuth();

  if (!isAuthenticated() || isAccessTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
