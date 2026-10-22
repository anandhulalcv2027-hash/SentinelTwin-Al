import { X, Activity } from 'lucide-react';
import type { Device } from '@/types/device';
import { TelemetrySection } from './TelemetrySection';

interface DeviceTelemetryDialogProps {
  device: Device;
  onClose: () => void;
}

export function DeviceTelemetryDialog({
  device,
  onClose,
}: DeviceTelemetryDialogProps) {
  return (
    <div className="st-modal-overlay">
      <div
        className="st-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 700,
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
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Activity
              size={21}
              color="var(--color-accent)"
            />

            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                Device Telemetry
              </h2>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.2rem',
                }}
              >
                {device.name}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
            aria-label="Close telemetry"
          >
            <X size={19} />
          </button>
        </div>

        <TelemetrySection deviceId={device.id} />
      </div>
    </div>
  );
}
