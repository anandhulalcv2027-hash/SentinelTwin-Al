import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { deviceService, handleDeviceError } from '@/services/deviceService';
import type { DeviceCreateRequest } from '@/types/device';

interface DeviceRegistrationDialogProps {
  onClose: () => void;
  onSuccess: (token: string, deviceName: string) => void;
}

export function DeviceRegistrationDialog({ onClose, onSuccess }: DeviceRegistrationDialogProps) {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('endpoint');
  
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<{name?: string; identifier?: string}>({});

  const validate = () => {
    const next: {name?: string; identifier?: string} = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!identifier.trim()) next.identifier = 'Identifier is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const payload: DeviceCreateRequest = {
        name,
        device_identifier: identifier,
        description: description || null,
        device_type: type,
      };
      const response = await deviceService.createDevice(payload);
      onSuccess(response.heartbeat_token, response.device.name);
    } catch (err) {
      setApiError(handleDeviceError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div className="st-card animate-fade-in" style={{ width: '100%', maxWidth: 450, padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Register Device
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {apiError && (
          <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.08)', border: '1px solid rgba(248, 81, 73, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="st-label">Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
              className={`st-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. srv-prod-01"
              disabled={submitting}
              autoFocus
            />
            {errors.name && <p className="st-error-text">{errors.name}</p>}
          </div>

          <div>
            <label className="st-label">Identifier *</label>
            <input
              type="text"
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setErrors(p => ({...p, identifier: ''})); }}
              className={`st-input ${errors.identifier ? 'error' : ''}`}
              placeholder="Unique device ID or MAC"
              disabled={submitting}
            />
            {errors.identifier && <p className="st-error-text">{errors.identifier}</p>}
          </div>

          <div>
            <label className="st-label">Device Type</label>
            <input
              type="text"
              value={type}
              onChange={e => setType(e.target.value)}
              className="st-input"
              placeholder="e.g. endpoint, sensor, server"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="st-label">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="st-input"
              style={{ minHeight: 80, resize: 'vertical' }}
              placeholder="Optional notes about this device..."
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="st-btn-ghost" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="st-btn-primary" disabled={submitting}>
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Registering…</>
              ) : (
                'Register Device'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
