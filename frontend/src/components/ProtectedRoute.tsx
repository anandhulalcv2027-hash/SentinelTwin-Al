import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

/**
 * Wraps routes that require authentication.
 * While the auth state is still loading (e.g. validating a stored token),
 * renders nothing to avoid a flash-redirect to /login.
 */
export function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}
      >
        Verifying session…
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
