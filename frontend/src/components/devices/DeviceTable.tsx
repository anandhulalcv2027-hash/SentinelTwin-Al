import {
  Edit2,
  Trash2,
  Monitor,
  DownloadCloud,
  Activity,
} from 'lucide-react';

import type { Device } from '@/types/device';
import { DeviceStatusBadge } from './DeviceStatusBadge';
import { parseBackendTimestamp } from '@/lib/dateUtils';
import { ShieldAlert } from 'lucide-react';

interface DeviceTableProps {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onDownloadAgent: (device: Device) => void;
  onTelemetry: (device: Device) => void;
  onIsolate?: (device: Device) => void;
}

export function DeviceTable({
  devices,
  onEdit,
  onDelete,
  onDownloadAgent,
  onTelemetry,
  onIsolate,
}: DeviceTableProps) {
  if (devices.length === 0) {
    return null;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom:
                '1px solid var(--color-border)',
              backgroundColor:
                'var(--color-bg-overlay)',
            }}
          >
            <th
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Device
            </th>

            <th
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Identifier
            </th>

            <th
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Status
            </th>

            <th
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Connectivity
            </th>

            <th
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color:
                  'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'right',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {devices.map((device) => (
            <tr
              key={device.id}
              style={{
                borderBottom:
                  '1px solid var(--color-border-subtle)',
              }}
            >
              <td
                style={{
                  padding: '0.85rem 1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      padding: '0.4rem',
                      backgroundColor:
                        'var(--color-bg-overlay)',
                      borderRadius:
                        'var(--radius-md)',
                      color:
                        'var(--color-accent)',
                    }}
                  >
                    <Monitor size={16} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color:
                          'var(--color-text-primary)',
                      }}
                    >
                      {device.name}
                    </div>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        color:
                          'var(--color-text-muted)',
                        marginTop: '0.1rem',
                      }}
                    >
                      {device.device_type}
                    </div>
                  </div>
                </div>
              </td>

              <td
                style={{
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.85rem',
                  color:
                    'var(--color-text-secondary)',
                  fontFamily:
                    'var(--font-mono)',
                }}
              >
                {device.device_identifier}
              </td>

              <td
                style={{
                  padding: '0.85rem 1.25rem',
                }}
              >
                {device.is_isolated ? (
                  <span className="st-badge-critical" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    Isolated
                  </span>
                ) : device.is_active ? (
                  <span className="st-badge-healthy">
                    Active
                  </span>
                ) : (
                  <span className="st-badge-warn">
                    Inactive
                  </span>
                )}
              </td>

              <td
                style={{
                  padding: '0.85rem 1.25rem',
                }}
              >
                <DeviceStatusBadge
                  lastSeen={device.last_seen}
                />

                <div
                  style={{
                    fontSize: '0.7rem',
                    color:
                      'var(--color-text-muted)',
                    marginTop: '0.2rem',
                  }}
                >
                  {device.last_seen
                    ? parseBackendTimestamp(
                        device.last_seen,
                      )?.toLocaleString()
                    : ''}
                </div>
              </td>

              <td
                style={{
                  padding: '0.85rem 1.25rem',
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Download Agent */}
                  <button
                    onClick={() =>
                      onDownloadAgent(device)
                    }
                    className="st-btn-ghost"
                    style={{
                      padding: '0.35rem',
                      border: 'none',
                      color:
                        'var(--color-accent)',
                    }}
                    title="Download Agent"
                  >
                    <DownloadCloud size={16} />
                  </button>

                  {/* View Telemetry */}
                  <button
                    onClick={() =>
                      onTelemetry(device)
                    }
                    className="st-btn-ghost"
                    style={{
                      padding: '0.35rem',
                      border: 'none',
                      color:
                        'var(--color-accent)',
                    }}
                    title="View Telemetry"
                  >
                    <Activity size={16} />
                  </button>

                  {/* Isolate */}
                  {onIsolate && !device.is_isolated && (
                    <button
                      onClick={() => onIsolate(device)}
                      className="st-btn-ghost"
                      style={{
                        padding: '0.35rem',
                        border: 'none',
                        color: 'var(--color-danger)',
                      }}
                      title="Isolate Endpoint"
                    >
                      <ShieldAlert size={16} />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(device)}
                    className="st-btn-ghost"
                    style={{
                      padding: '0.35rem',
                      border: 'none',
                    }}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      onDelete(device)
                    }
                    className="st-btn-ghost"
                    style={{
                      padding: '0.35rem',
                      border: 'none',
                      color:
                        'var(--color-danger)',
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
