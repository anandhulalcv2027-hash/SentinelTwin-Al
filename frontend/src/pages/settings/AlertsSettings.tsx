import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/roles';

export function AlertsSettings() {
  const { user } = useAuth();
  const [cpu, setCpu] = useState(90);
  const [memory, setMemory] = useState(90);
  const [disk, setDisk] = useState(90);

  const admin = isAdmin(user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Alerts & Monitoring</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          Configure system-wide monitoring thresholds and behavior.
        </p>
      </div>

      <div className="st-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Global Thresholds</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Define the percentages at which the system generates High severity alerts.
          {!admin && ' You are viewing these settings in read-only mode.'}
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
          <div>
            <label className="st-label">CPU Usage (%)</label>
            <input
              type="number"
              className="st-input"
              value={cpu}
              onChange={e => setCpu(Number(e.target.value))}
              disabled={!admin}
              min={1}
              max={100}
            />
          </div>

          <div>
            <label className="st-label">Memory Usage (%)</label>
            <input
              type="number"
              className="st-input"
              value={memory}
              onChange={e => setMemory(Number(e.target.value))}
              disabled={!admin}
              min={1}
              max={100}
            />
          </div>

          <div>
            <label className="st-label">Disk Usage (%)</label>
            <input
              type="number"
              className="st-input"
              value={disk}
              onChange={e => setDisk(Number(e.target.value))}
              disabled={!admin}
              min={1}
              max={100}
            />
          </div>

          {admin && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-warn)', marginBottom: '0.5rem' }}>
                Backend threshold update API is currently pending.
              </p>
              <button type="button" className="st-btn-primary" disabled>
                Save Thresholds
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
