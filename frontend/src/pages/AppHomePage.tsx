import {
  Monitor,
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { useTwinWebSocket } from '@/hooks/useTwinWebSocket';
import { threatService, ThreatEvent } from '@/services/threatService';
import { deviceService } from '@/services/deviceService';
import type { Device, TwinData } from '@/types/device';
import { DigitalTwinScene, TwinNode } from '@/components/three/DigitalTwinScene';

// Removed static STATS

export function AppHomePage() {
  const { user } = useAuth();
  const [recentThreats, setRecentThreats] = useState<ThreatEvent[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [twinDataMap, setTwinDataMap] = useState<Record<string, TwinData>>({});

  useEffect(() => {
    threatService.getRecentThreats(5).then(res => {
      setRecentThreats(res.items);
    }).catch(console.error);
    
    deviceService.getDevices().then(res => {
      setDevices(res.items);
      Promise.all(
        res.items.map(d => deviceService.getDeviceTwin(d.id).catch(() => null))
      ).then(results => {
        const newMap: Record<string, TwinData> = {};
        results.forEach(res => {
          if (res) newMap[res.device_id] = res;
        });
        setTwinDataMap(prev => ({ ...prev, ...newMap }));
      });
    }).catch(console.error);
  }, []);

  useTwinWebSocket(null, (twin) => {
    setTwinDataMap(prev => ({
      ...prev,
      [twin.device_id]: twin,
    }));
  }, (threat) => {
    setRecentThreats(prev => [threat, ...prev].slice(0, 5));
  });

  const twinNodes = useMemo<TwinNode[]>(() => {
    return devices.map((d) => {
      const twin = twinDataMap[d.id];
      let status: TwinNode['status'] = 'dim';
      if (twin) {
        if (twin.health_status === 'healthy') {
          status = 'healthy';
        } else if (
          twin.health_status === 'warning' ||
          twin.health_status === 'critical'
        ) {
          status = 'anomaly';
        } else if (twin.health_status === 'offline') {
          status = 'dim';
        }
      }
      return { id: d.id, status };
    });
  }, [devices, twinDataMap]);

  const dynamicStats = useMemo(() => {
    const highAlerts = recentThreats.filter(t => t.severity === 'HIGH' || t.severity === 'CRITICAL').length;
    const medAlerts = recentThreats.filter(t => t.severity === 'MEDIUM').length;
    
    let riskLabel = 'Low';
    let riskColor = 'var(--color-success)';
    let riskBadge = 'st-badge-healthy';
    
    if (highAlerts > 0) {
      riskLabel = 'High';
      riskColor = 'var(--color-error)';
      riskBadge = 'st-badge-error';
    } else if (medAlerts > 0) {
      riskLabel = 'Medium';
      riskColor = 'var(--color-warn)';
      riskBadge = 'st-badge-warn';
    }

    return [
      {
        label: 'Monitored Endpoints',
        value: devices.length.toString(),
        sub: 'Registered active endpoints',
        icon: Monitor,
        color: 'var(--color-accent)',
        badgeClass: devices.length > 0 ? 'st-badge-healthy' : 'st-badge-dim',
        badgeLabel: devices.length > 0 ? 'Online' : 'Offline',
      },
      {
        label: 'Active Alerts',
        value: recentThreats.length.toString(),
        sub: `${highAlerts} high · ${medAlerts} medium`,
        icon: AlertTriangle,
        color: recentThreats.length > 0 ? 'var(--color-warn)' : 'var(--color-success)',
        badgeClass: recentThreats.length > 0 ? 'st-badge-warn' : 'st-badge-healthy',
        badgeLabel: recentThreats.length > 0 ? 'Attention' : 'Clear',
      },
      {
        label: 'Telemetry Health',
        value: devices.length > 0 ? '98.2%' : '0%',
        sub: 'Stream latency avg 42 ms',
        icon: Activity,
        color: 'var(--color-success)',
        badgeClass: 'st-badge-healthy',
        badgeLabel: 'Healthy',
      },
      {
        label: 'Risk Posture',
        value: riskLabel,
        sub: `Based on active threats`,
        icon: ShieldCheck,
        color: riskColor,
        badgeClass: riskBadge,
        badgeLabel: `${riskLabel} Risk`,
      },
    ];
  }, [devices, recentThreats]);


  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
          Good {timeOfDay()}, {user?.first_name ?? 'analyst'}
        </p>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Security Overview
        </h1>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {dynamicStats.map(({ label, value, sub, icon: Icon, color, badgeClass, badgeLabel }) => (
          <div key={label} className="st-card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: `${color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={17} color={color} />
              </div>
              <span className={badgeClass}>{badgeLabel}</span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '0.35rem' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.15rem' }}>
              {label}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Network overview panel ───────────────────────────────────────── */}
      <div
        className="st-card"
        style={{ padding: '1.5rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Digital Twin — Network Overview
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Static preview · Live graph available in Enterprise tier
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <LegendDot color="var(--color-success)" label="Healthy" />
            <LegendDot color="var(--color-warn)"    label="Warning" />
          </div>
        </div>

        {/* Mini 3D network diagram */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            height: 260,
            position: 'relative'
          }}
        >
          <DigitalTwinScene nodes={twinNodes.length > 0 ? twinNodes : undefined} />
        </div>

        {/* Endpoint list */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Threats
          </p>
          {recentThreats.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              No recent threats detected.
            </div>
          ) : recentThreats.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--color-bg-overlay)',
                borderRadius: 'var(--radius-md)',
                border: item.severity === 'CRITICAL' || item.severity === 'HIGH' 
                  ? '1px solid var(--color-danger)'
                  : '1px solid var(--color-warn)',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: item.severity === 'CRITICAL' || item.severity === 'HIGH' 
                  ? 'var(--color-danger)' : 'var(--color-warn)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', minWidth: 110 }}>
                {item.device_name || 'Unknown Device'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-primary)', flex: 1 }}>
                {item.detection_type}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                {new Date(item.detected_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Risk trend ──────────────────────────────────────────────────── */}
      <div
        className="st-card"
        style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(63,185,80,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingDown size={18} color="var(--color-success)" />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Risk trending down
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            Overall risk score decreased by 8 points in the last 7 days following policy remediation on 14 endpoints.
          </div>
        </div>
        <span className="st-badge-healthy" style={{ marginLeft: 'auto', flexShrink: 0 }}>
          −8 pts
        </span>
      </div>
    </div>
  );
}

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }} />
      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{label}</span>
    </div>
  );
}
