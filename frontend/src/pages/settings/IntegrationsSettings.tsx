export function IntegrationsSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Integrations</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Manage third-party integrations, API keys, and webhooks.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>SMTP Configuration</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          System email delivery settings. 
        </p>
        <button type="button" className="st-btn-outline" disabled>
          Configure SMTP
        </button>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Webhooks</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Send alerts to external systems like Slack or PagerDuty. 
        </p>
        <button type="button" className="st-btn-outline" disabled>
          Add Webhook
        </button>
      </div>
    </div>
  );
}
