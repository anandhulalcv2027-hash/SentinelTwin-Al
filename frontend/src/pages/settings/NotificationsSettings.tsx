export function NotificationsSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Notifications</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage your email and in-app notification preferences.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Email Notifications</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          (Backend API pending)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="checkbox" disabled checked />
            <span style={{ fontSize: '0.9rem' }}>Critical system alerts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="checkbox" disabled />
            <span style={{ fontSize: '0.9rem' }}>Device offline notifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="checkbox" disabled checked />
            <span style={{ fontSize: '0.9rem' }}>Security alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
