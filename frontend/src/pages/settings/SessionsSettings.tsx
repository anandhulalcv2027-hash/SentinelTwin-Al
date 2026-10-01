import { useAuth } from '@/lib/AuthContext';

export function SessionsSettings() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Sessions</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage your active login sessions and security.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Sessions</h3>
        
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current Session</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {user?.email}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Last login: {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Unknown'}
              </div>
            </div>
            <div className="st-badge-healthy">Active</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Revoking other sessions is pending backend API support.
          </p>
          <button type="button" className="st-btn-outline" disabled>
            Log Out Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
