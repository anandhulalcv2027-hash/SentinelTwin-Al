import { useEffect, useState } from 'react';
import { Server, Clock, Loader2 } from 'lucide-react';
import { deviceService } from '@/services/deviceService';
import type { DeviceTelemetry } from '@/types/device';
import { TelemetryMetric } from './TelemetryMetric';
import { UptimeDisplay } from './UptimeDisplay';
import { parseBackendTimestamp } from '@/lib/dateUtils';

type TelemetryHealth = {
  label: string;
  description: string;
  indicator: string;
};

function getTelemetryHealth(
  collectedAt: string,
): TelemetryHealth {
  const collectedDate = parseBackendTimestamp(collectedAt);

  if (!collectedDate) {
    return {
      label: 'Stale',
      description: 'Telemetry timestamp could not be verified.',
      indicator: 'var(--color-warning)',
    };
  }

  const ageMs = Date.now() - collectedDate.getTime();
  const ageMinutes = ageMs / 60_000;

  if (ageMinutes <= 2) {
    return {
      label: 'Reporting',
      description: 'Telemetry is being received recently.',
      indicator: 'var(--color-success)',
    };
  }

  if (ageMinutes <= 5) {
    return {
      label: 'Stale',
      description: 'Telemetry has not been received recently.',
      indicator: 'var(--color-warning)',
    };
  }

  return {
    label: 'Offline',
    description: 'Telemetry has not been received for more than 5 minutes.',
    indicator: 'var(--color-danger)',
  };
}

export function TelemetrySection({ deviceId }: { deviceId: string }) {
  const [telemetry, setTelemetry] =
    useState<DeviceTelemetry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTelemetry(showLoading = false) {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data =
          await deviceService.getDeviceTelemetry(deviceId);

        if (!cancelled) {
          setTelemetry(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            'Failed to load telemetry',
            err,
          );
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    }

    fetchTelemetry(true);

    const intervalId = window.setInterval(() => {
      fetchTelemetry(false);
    }, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [deviceId]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: '2rem',
          borderTop:
            '1px solid var(--color-border)',
          paddingTop: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color:
              'var(--color-text-primary)',
            marginBottom: '1rem',
          }}
        >
          Endpoint Telemetry
        </h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <Loader2
            size={20}
            className="animate-spin"
            color="var(--color-text-muted)"
          />
        </div>
      </div>
    );
  }

  const health = telemetry
    ? getTelemetryHealth(
      telemetry.collected_at,
    )
    : null;

  return (
    <div
      style={{
        marginTop: '2rem',
        borderTop:
          '1px solid var(--color-border)',
        paddingTop: '1.5rem',
      }}
    >
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color:
            'var(--color-text-primary)',
          marginBottom: '1rem',
        }}
      >
        Endpoint Telemetry
      </h3>

      {!telemetry ? (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor:
              'var(--color-bg-overlay)',
            borderRadius:
              'var(--radius-md)',
            textAlign: 'center',
            color:
              'var(--color-text-muted)',
            fontSize: '0.85rem',
          }}
        >
          <Server
            size={24}
            style={{
              margin:
                '0 auto 0.5rem',
              opacity: 0.5,
            }}
          />

          Telemetry data not available yet.

          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              opacity: 0.7,
            }}
          >
            Data will appear here when
            the endpoint begins reporting
            telemetry.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Telemetry health */}
          {health && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor:
                  'var(--color-bg-overlay)',
                borderRadius:
                  'var(--radius-md)',
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor:
                    health.indicator,
                  flexShrink: 0,
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color:
                      'var(--color-text-primary)',
                  }}
                >
                  {health.label}
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    color:
                      'var(--color-text-muted)',
                    marginTop: '0.15rem',
                  }}
                >
                  {health.description}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--color-text-muted)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.05em',
                  marginBottom:
                    '0.2rem',
                }}
              >
                Hostname
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color:
                    'var(--color-text-primary)',
                  fontWeight: 500,
                }}
              >
                {telemetry.hostname}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--color-text-muted)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.05em',
                  marginBottom:
                    '0.2rem',
                }}
              >
                Operating System
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color:
                    'var(--color-text-primary)',
                  fontWeight: 500,
                }}
              >
                {telemetry.operating_system}{' '}
                {telemetry.os_version}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--color-text-muted)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.05em',
                  marginBottom:
                    '0.2rem',
                }}
              >
                Agent Version
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color:
                    'var(--color-text-primary)',
                  fontWeight: 500,
                }}
              >
                {telemetry.agent_version}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--color-text-muted)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.05em',
                  marginBottom:
                    '0.2rem',
                }}
              >
                Uptime
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color:
                    'var(--color-text-primary)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: '0.3rem',
                }}
              >
                <Clock
                  size={14}
                  color="var(--color-text-secondary)"
                />

                <UptimeDisplay
                  seconds={
                    telemetry.uptime_seconds
                  }
                />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              backgroundColor:
                'var(--color-bg-overlay)',
              borderRadius:
                'var(--radius-md)',
            }}
          >
            <TelemetryMetric
              label="CPU Usage"
              valuePercent={
                telemetry.cpu_usage_percent
              }
            />

            <TelemetryMetric
              label="Memory Usage"
              valuePercent={
                telemetry.memory_usage_percent
              }
            />

            <TelemetryMetric
              label="Disk Usage"
              valuePercent={
                telemetry.disk_usage_percent
              }
            />

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop:
                  '1px solid var(--color-border-subtle)',
                fontSize: '0.75rem',
                color:
                  'var(--color-text-muted)',
                textAlign: 'right',
              }}
            >
              Last Collected:{' '}
              {parseBackendTimestamp(
                telemetry.collected_at,
              )?.toLocaleString() ||
                'Unknown'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}