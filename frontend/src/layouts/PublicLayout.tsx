import { Link, NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import type { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function PublicLayout({ children, hideNav = false }: PublicLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNav && <PublicNav />}
      <main style={{ flex: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}

function PublicNav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        {/* Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--color-text-primary)',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
          }}
        >
          <Shield size={20} color="var(--color-accent)" />
          SentinelTwin<span style={{ color: 'var(--color-accent)' }}>&nbsp;AI</span>
        </Link>

        {/* Centre nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="nav-links"
        >
          {['Product', 'Platform', 'Security'].map((label) => (
            <a
              key={label}
              href="#features"
              style={{
                padding: '0.375rem 0.75rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)')
              }
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NavLink to="/login" className="st-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            Sign in
          </NavLink>
          <NavLink to="/register" className="st-btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            Get started
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function PublicFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-surface)',
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
          }}
        >
          <Shield size={14} color="var(--color-accent)" />
          SentinelTwin AI
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} SentinelTwin AI. All rights reserved.
        </span>
        <span style={{ display: 'flex', gap: '1rem' }}>
          {['Privacy', 'Terms', 'Security'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.75rem',
                textDecoration: 'none',
              }}
            >
              {l}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
