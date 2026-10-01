import {
  Monitor,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Server,
  Network,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTwinWebSocket } from '@/hooks/useTwinWebSocket';
import { threatService, ThreatEvent } from '@/services/threatService';
import { deviceService } from '@/services/deviceService';
import type { Device, TwinData } from '@/types/device';
import { DigitalTwinScene, TwinNode } from '@/components/three/DigitalTwinScene';

export function SOCDashboardPage() {
  const [recentThreats, setRecentThreats] = useState<ThreatEvent[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [twinDataMap, setTwinDataMap] = useState<Record<string, TwinData>>({});

  useEffect(() => {
    // Poll threats and devices
    const fetchData = () => {
      threatService.getRecentThreats(15).then(res => {
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
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useTwinWebSocket(null, undefined, (threat) => {
    setRecentThreats(prev => [threat, ...prev].slice(0, 15));
  }, (twin) => {
    setTwinDataMap(prev => ({
      ...prev,
      [twin.device_id]: twin,
    }));
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

  const stats = useMemo(() => {
    const total = devices.length;
    const active = devices.filter(d => twinDataMap[d.id]?.health_status === 'healthy').length;
    const threats = recentThreats.filter(t => t.severity === 'critical' || t.severity === 'high').length;
    return { total, active, threats };
  }, [devices, twinDataMap, recentThreats]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#09090b', color: '#f4f4f5', overflow: 'hidden' }}>
      
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={28} color="#22d3ee" />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              SOC Command Center
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              LIVE TELEMETRY STREAM
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <StatBox label="Total Endpoints" value={stats.total} icon={<Server size={16} />} color="#22d3ee" />
          <StatBox label="Active Agents" value={stats.active} icon={<Activity size={16} />} color="#22c55e" />
          <StatBox label="Critical Threats" value={stats.threats} icon={<AlertTriangle size={16} />} color="#ef4444" />
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>
        
        {/* Left: 3D Twin & Geographic map (Centerpiece) */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
             <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
               Global Network Topology
             </h2>
             <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
               Real-time digital twin rendering
             </p>
          </div>
          
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #18181b 0%, #000 100%)' }}>
            <DigitalTwinScene nodes={twinNodes.length > 0 ? twinNodes : undefined} />
          </div>
          
          {/* Bottom Panel (System metrics) */}
          <div style={{ height: '220px', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', gap: '1rem', backgroundColor: '#000' }}>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '1rem', background: '#09090b' }}>
              <h3 style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network size={14} /> Network Traffic Volume
              </h3>
              {/* Fake chart bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ 
                    flex: 1, 
                    backgroundColor: i % 7 === 0 ? '#ef4444' : '#22d3ee', 
                    opacity: 0.6,
                    height: `${20 + Math.random() * 80}%`,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.5s ease'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Threat Feed */}
        <div style={{ backgroundColor: '#000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
             <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <AlertTriangle size={18} color="#ef4444" /> Live Threat Feed
             </h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentThreats.length === 0 ? (
              <div style={{ color: '#71717a', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                No active threats detected.
              </div>
            ) : recentThreats.map((threat) => (
              <div key={threat.id} style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${threat.severity === 'critical' ? '#ef4444' : threat.severity === 'high' ? '#f97316' : '#eab308'}`,
                borderRadius: '0 4px 4px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                animation: 'fade-in 0.5s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e4e4e7' }}>{threat.threat_type}</span>
                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>{new Date(threat.detected_at).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
                  Target: {threat.device_name || threat.device_id.split('-')[0]}
                </div>
                <div style={{ fontSize: '0.75rem', color: threat.severity === 'critical' ? '#ef4444' : '#f97316' }}>
                  Confidence: {(threat.confidence_score * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
