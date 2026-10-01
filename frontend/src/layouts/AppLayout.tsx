import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  Crosshair,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview',  to: '/app',      icon: LayoutDashboard },
  { label: 'SOC Wall',  to: '/app/soc',  icon: Crosshair },
  { label: 'Devices',   to: '/app/endpoints', icon: Monitor },
  { label: 'Users',     to: '/app/users',     icon: Users },
  { label: 'Alerts',    to: '/app/alerts',    icon: AlertTriangle },
  { label: 'Settings',  to: '/app/settings',  icon: Settings },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: sidebarOpen ? 220 : 60,
          minWidth: sidebarOpen ? 220 : 60,
          backgroundColor: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s, min-width 0.2s',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            borderBottom: '1px solid var(--color-border)',
            gap: '0.6rem',
            flexShrink: 0,
          }}
        >
          <Shield size={20} color="var(--color-accent)" />
          {sidebarOpen && (
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              SentinelTwin <span style={{ color: 'var(--color-accent)' }}>AI</span>
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'color 0.15s, background-color 0.15s',
                whiteSpace: 'nowrap',
              })}
            >
              <Icon size={16} />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            margin: '0.5rem',
            padding: '0.5rem',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronRight
            size={14}
            style={{
              transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header
          style={{
            height: 60,
            backgroundColor: 'var(--color-bg-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            flexShrink: 0,
          }}
        >
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {user.first_name} {user.last_name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {user.email}
                </div>
              </div>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {user.first_name[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.375rem 0.75rem',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-danger)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--color-bg-base)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
