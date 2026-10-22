import { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import {
  deviceService,
  handleDeviceError,
} from '@/services/deviceService';
import type {
  Device,
  DeviceUpdateRequest,
} from '@/types/device';

interface DeviceEditDialogProps {
  device: Device;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeviceEditDialog({
  device,
  onClose,
  onSuccess,
}: DeviceEditDialogProps) {
  const [name, setName] = useState(device.name);
  const [description, setDescription] = useState(
    device.description ?? '',
  );
  const [type, setType] = useState(device.device_type);
  const [isActive, setIsActive] = useState(
    device.is_active,
  );

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const validate = () => {
    const next: { name?: string } = {};

    if (!name.trim()) {
      next.name = 'Name is required.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const payload: DeviceUpdateRequest = {
        name,
        description: description || null,
        device_type: type,
        is_active: isActive,
      };

      await deviceService.updateDevice(
        device.id,
        payload,
      );

      onSuccess();
    } catch (err) {
      setApiError(handleDeviceError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="st-modal-overlay">
      <div
        className="st-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 550,
          padding: '1.5rem 1.75rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Edit Device
          </h2>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {apiError && (
          <div
            style={{
              backgroundColor:
                'rgba(248, 81, 73, 0.08)',
              border:
                '1px solid rgba(248, 81, 73, 0.3)',
              padding: '0.75rem',
              borderRadius:
                'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <AlertCircle
              size={14}
              style={{
                flexShrink: 0,
                marginTop: 2,
              }}
            />

            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <label className="st-label">
              Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({
                  ...p,
                  name: '',
                }));
              }}
              className={`st-input ${
                errors.name ? 'error' : ''
              }`}
              placeholder="e.g. srv-prod-01"
              disabled={submitting}
              autoFocus
            />

            {errors.name && (
              <p className="st-error-text">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="st-label">
              Identifier
            </label>

            <input
              type="text"
              value={device.device_identifier}
              readOnly
              className="st-input"
              disabled
              style={{
                backgroundColor:
                  'var(--color-bg-base)',
              }}
            />

            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.25rem',
              }}
            >
              Identifier cannot be changed.
            </p>
          </div>

          <div>
            <label className="st-label">
              Device Type
            </label>

            <input
              type="text"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="st-input"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="st-label">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="st-input"
              style={{
                minHeight: 80,
                resize: 'vertical',
              }}
              disabled={submitting}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <input
              type="checkbox"
              id="is-active-cb"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
              disabled={submitting}
              style={{
                accentColor:
                  'var(--color-accent)',
                width: 14,
                height: 14,
                cursor: 'pointer',
              }}
            />

            <label
              htmlFor="is-active-cb"
              style={{
                fontSize: '0.85rem',
                color:
                  'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Device is active
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="st-btn-ghost"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="st-btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
