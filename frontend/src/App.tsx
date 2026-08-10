import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AppHomePage } from '@/pages/AppHomePage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<AppHomePage />} />
              {/* Placeholder routes for sidebar links */}
              <Route path="/app/endpoints" element={<PlaceholderPage title="Endpoints" />} />
              <Route path="/app/alerts"    element={<PlaceholderPage title="Alerts" />} />
              <Route path="/app/settings"  element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-text-muted)',
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          marginBottom: '0.5rem',
        }}
      >
        Coming Soon
      </div>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        This section will be available in a future release.
      </p>
    </div>
  );
}
