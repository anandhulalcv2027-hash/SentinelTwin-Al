import {
  Monitor,
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// ─── Stat card data ───────────────────────────────────────────────────────────

const STATS = [
  {
    label: 'Monitored Endpoints',
    value: '247',
    sub: '+3 added today',
    icon: Monitor,
    color: 'var(--color-accent)',
    badgeClass: 'st-badge-healthy',
    badgeLabel: 'Online',
  },
  {
    label: 'Active Alerts',
    value: '3',
    sub: '1 high · 2 medium',
    icon: AlertTriangle,
    color: 'var(--color-warn)',
    badgeClass: 'st-badge-warn',
    badgeLabel: 'Attention',
  },
  {
    label: 'Telemetry Health',
    value: '98.2%',
    sub: 'Stream latency avg 42 ms',
    icon: Activity,
    color: 'var(--color-success)',
    badgeClass: 'st-badge-healthy',
    badgeLabel: 'Healthy',
  },
  {
    label: 'Risk Posture',
    value: 'Low',
    sub: 'Score: 12 / 100',
    icon: ShieldCheck,
    color: 'var(--color-success)',
    badgeClass: 'st-badge-healthy',
    badgeLabel: 'Low Risk',
  },
];

// ─── Mini network nodes ───────────────────────────────────────────────────────

const MINI_NODES = [
  { x: 130, y: 100, label: 'srv-prod-01',  status: 'healthy' },
  { x: 260, y: 80,  label: 'ws-dev-07',    status: 'healthy' },
  { x: 370, y: 120, label: 'iot-sensor-3', status: 'warn'    },
  { x: 200, y: 200, label: 'db-replica-2', status: 'healthy' },
  { x: 330, y: 200, label: 'edge-fw-01',   status: 'healthy' },
];

const STATUS_COLOR: Record<string, string> = {
  healthy: 'var(--color-success)',
  warn:    'var(--color-warn)',
  danger:  'var(--color-danger)',
};

export function AppHomePage() {
  const { user } = useAuth();

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
        {STATS.map(({ label, value, sub, icon: Icon, color, badgeClass, badgeLabel }) => (
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

        {/* Mini SVG network diagram */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <svg
            viewBox="0 0 500 280"
            width="100%"
            height={260}
            aria-label="Static network topology overview"
            role="img"
          >
            {/* Hub */}
            <circle cx="50" cy="150" r="22" fill="#06b6d4" opacity="0.9" />
            <circle cx="50" cy="150" r="32" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
            <text x="50" y="185" textAnchor="middle" fill="#8b949e" fontSize="8">Hub</text>

            {/* Connections from hub to nodes */}
            {MINI_NODES.map((n) => (
              <line
                key={n.label}
                x1="50" y1="150"
                x2={n.x} y2={n.y}
                stroke={STATUS_COLOR[n.status]}
                strokeWidth="0.8"
                opacity="0.35"
              />
            ))}

            {/* Nodes */}
            {MINI_NODES.map((n) => {
              const c = STATUS_COLOR[n.status];
              return (
                <g key={n.label}>
                  <circle cx={n.x} cy={n.y} r="14" fill={`${c}22`} stroke={c} strokeWidth="1.2" />
                  {n.status === 'warn' && (
                    <circle cx={n.x} cy={n.y} r="20" fill="none" stroke={c} strokeWidth="0.8" opacity="0.4" />
                  )}
                  <text x={n.x} y={n.y + 28} textAnchor="middle" fill="#6e7681" fontSize="7.5">
                    {n.label}
                  </text>
                  {n.status === 'warn' && (
                    <text x={n.x + 10} y={n.y - 10} fill="var(--color-warn)" fontSize="10" fontWeight="bold">!</text>
                  )}
                </g>
              );
            })}

            {/* Telemetry pulse dots (static representation) */}
            {[0.3, 0.6].map((frac, i) => (
              <circle
                key={i}
                cx={50 + (MINI_NODES[0].x - 50) * frac}
                cy={150 + (MINI_NODES[0].y - 150) * frac}
                r="3"
                fill="#22d3ee"
                opacity="0.7"
              />
            ))}
          </svg>
        </div>

        {/* Endpoint list */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Activity
          </p>
          {[
            { label: 'srv-prod-01',   msg: 'Telemetry stream active',    status: 'healthy', time: '2s ago'  },
            { label: 'iot-sensor-3',  msg: 'Anomalous CPU spike (94%)', status: 'warn',    time: '14s ago' },
            { label: 'ws-dev-07',     msg: 'Policy compliance verified', status: 'healthy', time: '1m ago'  },
            { label: 'db-replica-2',  msg: 'Snapshot completed',         status: 'healthy', time: '3m ago'  },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--color-bg-overlay)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: STATUS_COLOR[item.status],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', minWidth: 110 }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', flex: 1 }}>
                {item.msg}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                {item.time}
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
