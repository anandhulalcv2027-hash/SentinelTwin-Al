export function SystemSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>System Settings</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          View platform health and system information.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Platform Status</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '500px' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>API Connectivity</div>
            <div className="st-badge-healthy">Online</div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Database</div>
            <div className="st-badge-healthy">Connected</div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Agent Gateway</div>
            <div className="st-badge-healthy">Operational</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Version</div>
            <div style={{ fontWeight: 600 }}>v1.0.0-beta</div>
          </div>
        </div>
      </div>
      
      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Advanced Diagnostic Logs</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Download system diagnostic logs for troubleshooting. (Backend API pending)
        </p>
        <button type="button" className="st-btn-outline" disabled>
          Download Logs
        </button>
      </div>
    </div>
  );
}
