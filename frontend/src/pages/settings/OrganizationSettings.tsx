export function OrganizationSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Organization</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage your organization details and workspace settings.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Organization Details</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <div>
            <label className="st-label">Organization Name</label>
            <input
              type="text"
              className="st-input"
              value="SentinelTwin AI Corp"
              disabled
            />
          </div>
          <div>
            <label className="st-label">Organization Slug</label>
            <input
              type="text"
              className="st-input"
              value="sentineltwin-ai-corp"
              disabled
            />
          </div>
          <button type="button" className="st-btn-primary" disabled style={{ width: 'fit-content', marginTop: '0.5rem' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
