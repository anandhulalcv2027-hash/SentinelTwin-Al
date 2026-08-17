import { AlertTriangle, Copy, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeartbeatTokenDialogProps {
  token: string | null;
  deviceName: string;
  onClose: () => void;
}

export function HeartbeatTokenDialog({ token, deviceName, onClose }: HeartbeatTokenDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      setCopied(false);
    }
  }, [token]);

  if (!token) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div className="st-card animate-fade-in" style={{ width: '100%', maxWidth: 500, padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Registration Successful
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ backgroundColor: 'rgba(210, 153, 34, 0.08)', border: '1px solid rgba(210, 153, 34, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--color-warn)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Important: This credential is shown only once.</strong>
            Copy and securely configure it on the <strong>{deviceName}</strong> endpoint agent before closing this dialog.
          </div>
        </div>

        <div>
          <label className="st-label">Heartbeat Token</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={token}
              className="st-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent)' }}
            />
            <button
              onClick={handleCopy}
              className="st-btn-primary"
              style={{ padding: '0 1rem', flexShrink: 0 }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button onClick={onClose} className="st-btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
