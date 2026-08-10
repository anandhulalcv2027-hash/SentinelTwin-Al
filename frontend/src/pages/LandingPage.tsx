import { Link } from 'react-router-dom';
import {
  Monitor,
  Activity,
  GitBranch,
  AlertTriangle,
  Brain,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DigitalTwinScene } from '@/components/three/DigitalTwinScene';

const CAPABILITIES = [
  {
    icon: Monitor,
    title: 'Endpoint Visibility',
    body: 'Real-time inventory and state tracking for every managed endpoint across your environment.',
  },
  {
    icon: Activity,
    title: 'Live Telemetry',
    body: 'Continuous stream of behavioral metrics, process events, and network activity from each device.',
  },
  {
    icon: GitBranch,
    title: 'Digital Twins',
    body: 'Persistent virtual models of your endpoints that evolve with device state and configuration changes.',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Detection',
    body: 'Signature-free anomaly detection that surfaces deviations from baseline device behavior.',
  },
  {
    icon: Brain,
    title: 'AI Risk Analysis',
    body: 'AI-assisted risk scoring and investigation guidance to accelerate analyst decision-making.',
  },
];

export function LandingPage() {
  return (
    <PublicLayout>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '4rem 1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
          minHeight: 'calc(100vh - 60px - 72px)',
        }}
        className="hero-grid"
      >
        {/* Left — copy */}
        <div className="animate-fade-in">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'var(--color-accent-dim)',
              border: '1px solid var(--color-accent)',
              borderRadius: 999,
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={12} color="var(--color-accent)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
              ENDPOINT SECURITY PLATFORM
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Your endpoints,<br />
            <span style={{ color: 'var(--color-accent)' }}>mirrored and monitored</span><br />
            in real time.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: 460,
              marginBottom: '2rem',
            }}
          >
            SentinelTwin AI builds living digital twins of every device in your fleet —
            correlating telemetry, detecting anomalies, and surfacing risk before
            threats escalate.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="st-btn-primary" id="hero-cta-register">
              Get started
              <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="st-btn-ghost" id="hero-cta-login">
              Sign in
            </Link>
          </div>

          {/* Social proof line */}
          <p
            style={{
              marginTop: '2rem',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={13} color="var(--color-success)" />
            Trusted by security operations teams in regulated industries
          </p>
        </div>

        {/* Right — Three.js scene */}
        <div
          style={{
            height: 440,
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
          }}
          className="hero-scene"
        >
          {/* Legend overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <LegendItem color="#22d3ee" label="Healthy connection" />
            <LegendItem color="#d29922" label="Anomaly detected" />
          </div>
          <DigitalTwinScene style={{ width: '100%', height: '100%' }} />
        </div>
      </section>

      {/* ── Capabilities ────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '4rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Platform Capabilities
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Everything your SOC needs to stay ahead.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                style={{
                  padding: '1.75rem 1.5rem',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRight: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={18} color="var(--color-accent)" />
                </div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Ready to see inside your fleet?
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}
          >
            Start monitoring endpoints and building digital twins in minutes.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="st-btn-primary" id="footer-cta-register">
              Get started free
              <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="st-btn-ghost" id="footer-cta-login">
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 2rem !important;
            min-height: unset !important;
          }
          .hero-scene {
            height: 300px !important;
          }
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{label}</span>
    </div>
  );
}
