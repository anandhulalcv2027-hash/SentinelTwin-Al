import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AppHomePage } from '@/pages/AppHomePage';
import { EndpointsPage } from '@/pages/EndpointsPage';
import { UsersPage } from '@/pages/UsersPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { SOCDashboardPage } from '@/pages/SOCDashboardPage';

// Settings Pages
import { SettingsLayout } from '@/layouts/SettingsLayout';
import { AccountSettings } from '@/pages/settings/AccountSettings';
import { OrganizationSettings } from '@/pages/settings/OrganizationSettings';
import { UsersRolesSettings } from '@/pages/settings/UsersRolesSettings';
import { SecuritySettings } from '@/pages/settings/SecuritySettings';
import { PreferencesSettings } from '@/pages/settings/PreferencesSettings';
import { EndpointsSettings } from '@/pages/settings/EndpointsSettings';
import { AlertsSettings } from '@/pages/settings/AlertsSettings';
import { NotificationsSettings } from '@/pages/settings/NotificationsSettings';
import { IntegrationsSettings } from '@/pages/settings/IntegrationsSettings';
import { AuditLogsSettings } from '@/pages/settings/AuditLogsSettings';
import { SessionsSettings } from '@/pages/settings/SessionsSettings';
import { SystemSettings } from '@/pages/settings/SystemSettings';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/verify-email"
            element={<VerifyEmailPage />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<AppHomePage />} />
              {/* Main App Routes */}
              <Route path="/app/endpoints" element={<EndpointsPage />} />
              <Route path="/app/users" element={<UsersPage />} />
              <Route path="/app/alerts" element={<AlertsPage />} />
              <Route path="/app/soc" element={<SOCDashboardPage />} />
              
              {/* Settings routes */}
              <Route path="/app/settings" element={<SettingsLayout />}>
                <Route path="account" element={<AccountSettings />} />
                <Route path="organization" element={<OrganizationSettings />} />
                <Route path="users" element={<UsersRolesSettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="preferences" element={<PreferencesSettings />} />
                <Route path="endpoints" element={<EndpointsSettings />} />
                <Route path="alerts" element={<AlertsSettings />} />
                <Route path="notifications" element={<NotificationsSettings />} />
                <Route path="integrations" element={<IntegrationsSettings />} />
                <Route path="audit" element={<AuditLogsSettings />} />
                <Route path="sessions" element={<SessionsSettings />} />
                <Route path="system" element={<SystemSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


