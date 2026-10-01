import { Link } from 'react-router-dom';

export function EndpointsSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Endpoints & Agents</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Configure agent settings and enrollment policies.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Device Management</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Device registration, telemetry, and agent downloads are managed from the main Devices section.
        </p>
        <Link to="/app/endpoints" className="st-btn-outline" style={{ textDecoration: 'none' }}>
          Go to Devices Page
        </Link>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Global Agent Configuration</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          (Backend API pending)
        </p>
        <div style={{ maxWidth: '300px' }}>
          <label className="st-label">Default Heartbeat Interval (seconds)</label>
          <input type="number" className="st-input" value={60} disabled />
        </div>
      </div>
    </div>
  );
}
