import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { deviceService, handleDeviceError } from '@/services/deviceService';
import type { Device } from '@/types/device';

interface DeleteDeviceDialogProps {
  device: Device;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteDeviceDialog({ device, onClose, onSuccess }: DeleteDeviceDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleDelete = async () => {
    setSubmitting(true);
    setApiError('');
    try {
      await deviceService.deleteDevice(device.id);
      onSuccess();
    } catch (err) {
      setApiError(handleDeviceError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div className="st-card animate-fade-in" style={{ width: '100%', maxWidth: 400, padding: '1.5rem 1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} color="var(--color-danger)" />
          Delete Device?
        </h2>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          This action permanently removes <strong>{device.name}</strong> from the organization.
        </p>

        {apiError && (
          <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.08)', border: '1px solid rgba(248, 81, 73, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            {apiError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="st-btn-ghost" disabled={submitting}>
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            className="st-btn-primary" 
            disabled={submitting}
            style={{ backgroundColor: 'var(--color-danger)', color: '#fff' }}
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Deleting…</>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
