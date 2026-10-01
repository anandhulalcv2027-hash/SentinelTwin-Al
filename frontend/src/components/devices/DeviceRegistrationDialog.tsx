import { useState } from 'react';
import {
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Activity,
  Monitor,
  Server,
  Laptop,
  Info,
} from 'lucide-react';

import {
  deviceService,
  handleDeviceError,
} from '@/services/deviceService';

import type { DeviceCreateRequest, Device } from '@/types/device';

interface DeviceRegistrationDialogProps {
  onClose: () => void;
  onSuccess: (device: Device) => void;
}

const DEVICE_TYPES = [
  {
    value: 'endpoint',
    label: 'Endpoint',
    description: 'Desktop or laptop monitored by SentinelTwin',
    icon: Laptop,
  },
  {
    value: 'server',
    label: 'Server',
    description: 'Server or infrastructure endpoint',
    icon: Server,
  },
  {
    value: 'workstation',
    label: 'Workstation',
    description: 'Managed employee workstation',
    icon: Monitor,
  },
];

export function DeviceRegistrationDialog({
  onClose,
  onSuccess,
}: DeviceRegistrationDialogProps) {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('endpoint');

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    identifier?: string;
  }>({});

  const validate = () => {
    const next: {
      name?: string;
      identifier?: string;
    } = {};

    if (!name.trim()) {
      next.name = 'Endpoint name is required.';
    }

    if (!identifier.trim()) {
      next.identifier = 'Device identifier is required.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const payload: DeviceCreateRequest = {
        name: name.trim(),
        device_identifier: identifier.trim(),
        description: description.trim() || null,
        device_type: type,
      };

      const response = await deviceService.createDevice(payload);

      onSuccess(response.device);
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
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom:
              '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius:
                  'var(--radius-md)',
                backgroundColor:
                  'rgba(34, 211, 238, 0.1)',
                color:
                  'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Monitor size={21} />
            </div>

            <div>
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 650,
                  color:
                    'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                Register Endpoint
              </h2>

              <p
                style={{
                  marginTop: '0.3rem',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  color:
                    'var(--color-text-muted)',
                }}
              >
                Connect a device to SentinelTwin
                endpoint monitoring.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color:
                'var(--color-text-muted)',
              cursor: submitting
                ? 'not-allowed'
                : 'pointer',
              padding: '0.2rem',
            }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Security banner */}
        <div
          style={{
            margin: '1.25rem 1.75rem 0',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            backgroundColor: 'rgba(34, 211, 238, 0.06)',
            display: 'flex',
            gap: '0.7rem',
          }}
        >
          <ShieldCheck size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
              Seamless Agent Deployment
            </div>
            <div style={{ fontSize: '0.72rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
              After registration, you can download a pre-configured agent package to deploy on the endpoint.
            </div>
          </div>
        </div>

        {/* Error */}
        {apiError && (
          <div
            role="alert"
            style={{
              margin: '1rem 1.75rem 0',
              backgroundColor:
                'rgba(248, 81, 73, 0.08)',
              border:
                '1px solid rgba(248, 81, 73, 0.3)',
              padding: '0.75rem',
              borderRadius:
                'var(--radius-md)',
              color:
                'var(--color-danger)',
              fontSize: '0.78rem',
              display: 'flex',
              gap: '0.5rem',
              lineHeight: 1.45,
            }}
          >
            <AlertCircle
              size={15}
              style={{
                flexShrink: 0,
                marginTop: 1,
              }}
            />

            <span>{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding:
              '1.5rem 1.75rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          {/* Endpoint identity */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.9rem',
              }}
            >
              <Activity
                size={15}
                color="var(--color-accent)"
              />

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 650,
                  color:
                    'var(--color-text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Endpoint Identity
              </span>
            </div>

            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="st-label">
                Endpoint Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    name: undefined,
                  }));
                }}
                className={`st-input ${
                  errors.name ? 'error' : ''
                }`}
                placeholder="e.g. DEV-WORKSTATION-01"
                disabled={submitting}
                autoFocus
              />

              <div
                style={{
                  marginTop: '0.35rem',
                  fontSize: '0.68rem',
                  color:
                    'var(--color-text-muted)',
                }}
              >
                A recognizable name for this monitored
                endpoint.
              </div>

              {errors.name && (
                <p className="st-error-text">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Identifier */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="st-label">
                Device Identifier *
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    identifier: undefined,
                  }));
                }}
                className={`st-input ${
                  errors.identifier
                    ? 'error'
                    : ''
                }`}
                placeholder="e.g. ANANDHU-PC-001"
                disabled={submitting}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  alignItems: 'flex-start',
                  marginTop: '0.35rem',
                  fontSize: '0.68rem',
                  color:
                    'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                <Info
                  size={12}
                  style={{
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                />

                <span>
                  Must be unique within the SentinelTwin
                  environment.
                </span>
              </div>

              {errors.identifier && (
                <p className="st-error-text">
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Device type */}
            <div>
              <label className="st-label">
                Endpoint Type
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, 1fr)',
                  gap: '0.6rem',
                }}
              >
                {DEVICE_TYPES.map((deviceType) => {
                  const Icon =
                    deviceType.icon;

                  const selected =
                    type === deviceType.value;

                  return (
                    <button
                      key={deviceType.value}
                      type="button"
                      onClick={() =>
                        setType(
                          deviceType.value,
                        )
                      }
                      disabled={submitting}
                      style={{
                        textAlign: 'left',
                        border: selected
                          ? '1px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                        backgroundColor: selected
                          ? 'rgba(34, 211, 238, 0.07)'
                          : 'var(--color-bg-overlay)',
                        borderRadius:
                          'var(--radius-md)',
                        padding:
                          '0.75rem',
                        cursor: submitting
                          ? 'not-allowed'
                          : 'pointer',
                        color:
                          'var(--color-text-primary)',
                      }}
                    >
                      <Icon
                        size={17}
                        color={
                          selected
                            ? 'var(--color-accent)'
                            : 'var(--color-text-secondary)'
                        }
                      />

                      <div
                        style={{
                          marginTop:
                            '0.45rem',
                          fontSize:
                            '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {deviceType.label}
                      </div>

                      <div
                        style={{
                          marginTop:
                            '0.2rem',
                          fontSize:
                            '0.62rem',
                          lineHeight: 1.35,
                          color:
                            'var(--color-text-muted)',
                        }}
                      >
                        {
                          deviceType.description
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="st-label">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              className="st-input"
              style={{
                minHeight: 75,
                resize: 'vertical',
              }}
              placeholder="Optional notes about this endpoint..."
              disabled={submitting}
            />
          </div>

          {/* What happens next */}
          <div
            style={{
              padding: '0.9rem 1rem',
              backgroundColor:
                'var(--color-bg-overlay)',
              borderRadius:
                'var(--radius-md)',
              border:
                '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color:
                  'var(--color-text-primary)',
                marginBottom: '0.55rem',
              }}
            >
              What happens next?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
              <div><strong>01</strong>{'  '}SentinelTwin registers the endpoint.</div>
              <div><strong>02</strong>{'  '}Download the device-specific agent package.</div>
              <div><strong>03</strong>{'  '}Deploy the agent on the target machine.</div>
              <div><strong>04</strong>{'  '}Monitoring begins automatically.</div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.25rem',
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
                  Registering…
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Register Endpoint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}