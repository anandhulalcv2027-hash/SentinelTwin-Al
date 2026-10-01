export function AuditLogsSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Audit Logs</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Review important administrative and security actions within the platform.
        </p>
      </div>

      <div className="st-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Audit Logging Not Implemented</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
          The backend audit log API is currently pending. Once implemented, this section will display a secure, read-only history of platform actions.
        </p>
      </div>
    </div>
  );
}
