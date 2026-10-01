export function SecuritySettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Security</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Configure authentication and platform security policies.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Password Policy</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          (Backend API pending)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input type="checkbox" disabled checked />
          <span style={{ fontSize: '0.9rem' }}>Require uppercase letters</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <input type="checkbox" disabled checked />
          <span style={{ fontSize: '0.9rem' }}>Require numbers</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <input type="checkbox" disabled checked />
          <span style={{ fontSize: '0.9rem' }}>Require special characters</span>
        </div>
      </div>
    </div>
  );
}
