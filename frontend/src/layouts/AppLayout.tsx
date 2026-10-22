import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Network,
  Activity,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview',  to: '/app',      icon: LayoutDashboard },
  { label: 'SOC Wall',  to: '/app/soc',  icon: Crosshair },
  { label: 'Topology',  to: '/app/topology', icon: Network },
  { label: 'Incidents', to: '/app/incidents', icon: Shield },
  { label: 'Analytics', to: '/app/analytics', icon: Activity },
  { label: 'Devices',   to: '/app/endpoints', icon: Monitor },
  { label: 'Users',     to: '/app/users',     icon: Users },
  { label: 'Alerts',    to: '/app/alerts',    icon: AlertTriangle },
  { label: 'Settings',  to: '/app/settings',  icon: Settings },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const [hasNotifs, setHasNotifs] = useState(true);

  // Close notifications dropdown when navigating between pages
  useEffect(() => {
    setShowNotifs(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 76,
          minWidth: sidebarOpen ? 260 : 76,
          backgroundColor: 'var(--color-glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--color-glass-border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.25rem',
            borderBottom: '1px solid var(--color-glass-border)',
            gap: '0.8rem',
            flexShrink: 0,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-overlay)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-accent) 0%, #a855f7 100%)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          {sidebarOpen && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                SentinelTwin <span style={{ color: 'var(--color-accent)' }}>AI</span>
              </span>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) => `st-nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-glass-border)' : 'transparent',
                boxShadow: isActive ? 'inset 0 0 20px var(--color-glass-shadow)' : 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    style={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      color: isActive ? 'var(--color-accent)' : 'inherit',
                    }} 
                  />
                  {sidebarOpen && <span style={{ opacity: 1, transition: 'opacity 0.3s' }}>{label}</span>}
                  
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      bottom: '25%',
                      width: 4,
                      background: 'linear-gradient(to bottom, var(--color-accent), #a855f7)',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '0 0 10px var(--color-accent)',
                    }} />
                  )}
                </>
              )}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-bg-base)' }}>
        {/* Topbar */}
        <header
          style={{
            height: 72,
            backgroundColor: 'var(--color-glass-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-glass-border)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1.5rem',
            flexShrink: 0,
            position: 'relative',
            zIndex: 30,
          }}
        >
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  className="st-icon-button"
                  onClick={() => setShowNotifs(!showNotifs)}
                  style={{ 
                    position: 'relative', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <Bell size={20} />
                  {hasNotifs && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 8,
                        height: 8,
                        backgroundColor: 'var(--color-error)',
                        borderRadius: '50%',
                        border: '2px solid var(--color-bg-surface)'
                      }} 
                    />
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifs && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '320px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 50,
                    overflow: 'hidden',
                    animation: 'fade-in 0.2s ease'
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Notifications</h3>
                      {hasNotifs && (
                        <span 
                          onClick={() => setHasNotifs(false)}
                          style={{ fontSize: '0.75rem', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 500 }}
                        >
                          Mark all read
                        </span>
                      )}
                    </div>
                    <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                       {!hasNotifs ? (
                         <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                           You're all caught up!
                         </div>
                       ) : (
                         <>
                           <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', backgroundColor: 'var(--color-bg-base)' }}>
                             <div style={{ marginTop: '0.2rem', color: 'var(--color-error)' }}><AlertTriangle size={16} /></div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>High Risk Anomaly</span>
                               <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Unusual lateral movement detected on endpoint WIN-SRV-01. Automatic isolation triggered.</span>
                               <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>2 minutes ago</span>
                             </div>
                           </div>
                           
                           <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem' }}>
                             <div style={{ marginTop: '0.2rem', color: 'var(--color-warn)' }}><Activity size={16} /></div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                               <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>Agent Offline</span>
                               <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Device DESKTOP-HQ-9 missed 3 heartbeats.</span>
                               <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>15 minutes ago</span>
                             </div>
                           </div>
                           
                           <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem' }}>
                             <div style={{ marginTop: '0.2rem', color: 'var(--color-success)' }}><Shield size={16} /></div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                               <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>System Update</span>
                               <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>All SentinelTwin agents successfully updated to v2.1.0 without interruption.</span>
                               <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>1 hour ago</span>
                             </div>
                           </div>
                         </>
                       )}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }} />

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
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', backgroundColor: 'transparent', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50%',
            height: '50%',
            background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%)',
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 0,
          }} />
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
