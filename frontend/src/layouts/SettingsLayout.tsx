import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin, isAnalyst } from '@/lib/roles';
import {
  UserCircle,
  Building,
  Users,
  ShieldCheck,
  Settings2,
  Server,
  Bell,
  Link,
  ClipboardList,
  Activity,
  History
} from 'lucide-react';

interface SettingsNavRoute {
  label: string;
  path: string;
  icon: React.FC<any>;
  allowed: (user: any) => boolean;
}

const SETTINGS_ROUTES: SettingsNavRoute[] = [
  {
    label: 'Account',
    path: '/app/settings/account',
    icon: UserCircle,
    allowed: () => true, // Everyone can see account
  },
  {
    label: 'Organization',
    path: '/app/settings/organization',
    icon: Building,
    allowed: isAdmin,
  },
  {
    label: 'Users & Roles',
    path: '/app/settings/users',
    icon: Users,
    allowed: isAdmin,
  },
  {
    label: 'Security',
    path: '/app/settings/security',
    icon: ShieldCheck,
    allowed: (user) => isAdmin(user) || isAnalyst(user),
  },
  {
    label: 'Preferences',
    path: '/app/settings/preferences',
    icon: Settings2,
    allowed: () => true,
  },
  {
    label: 'Endpoints & Agents',
    path: '/app/settings/endpoints',
    icon: Server,
    allowed: isAdmin,
  },
  {
    label: 'Alerts & Monitoring',
    path: '/app/settings/alerts',
    icon: Activity,
    allowed: (user) => isAdmin(user) || isAnalyst(user),
  },
  {
    label: 'Notifications',
    path: '/app/settings/notifications',
    icon: Bell,
    allowed: () => true,
  },
  {
    label: 'Integrations',
    path: '/app/settings/integrations',
    icon: Link,
    allowed: isAdmin,
  },
  {
    label: 'Audit Logs',
    path: '/app/settings/audit',
    icon: ClipboardList,
    allowed: isAdmin,
  },
  {
    label: 'Sessions',
    path: '/app/settings/sessions',
    icon: History,
    allowed: () => true,
  },
  {
    label: 'System',
    path: '/app/settings/system',
    icon: Activity, // Reuse or find better icon
    allowed: isAdmin,
  }
];

export function SettingsLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allowedRoutes = SETTINGS_ROUTES.filter(route => route.allowed(user));

  // If user navigates exactly to /app/settings, redirect to the first allowed route (usually account)
  if (location.pathname === '/app/settings' || location.pathname === '/app/settings/') {
    if (allowedRoutes.length > 0) {
      return <Navigate to={allowedRoutes[0].path} replace />;
    }
  }

  // Check if current route is allowed
  const currentNavRoute = SETTINGS_ROUTES.find(r => location.pathname.startsWith(r.path));
  if (currentNavRoute && !currentNavRoute.allowed(user)) {
    // Unauthorized access attempt, redirect to safe allowed route
    return <Navigate to={allowedRoutes[0]?.path || '/app'} replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Manage your account and platform configuration
        </p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flex: 1, overflow: 'hidden' }}>
        {/* Settings Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {allowedRoutes.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </aside>

        {/* Settings Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}>
          <div style={{ maxWidth: '800px' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
