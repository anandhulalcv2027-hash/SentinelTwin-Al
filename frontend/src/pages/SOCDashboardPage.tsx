import {
  AlertTriangle,
  Activity,
  ShieldCheck,
  Server,
  Network,
  Shield,
  Bell
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTwinWebSocket } from '@/hooks/useTwinWebSocket';
import { threatService, ThreatEvent } from '@/services/threatService';
import { deviceService } from '@/services/deviceService';
import { incidentService } from '@/services/incidentService';
import api from '@/lib/api';
import type { Device, TwinData } from '@/types/device';
import { Incident } from '@/types/incident';
import { DigitalTwinScene, TwinNode } from '@/components/three/DigitalTwinScene';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export function SOCDashboardPage() {
  const [recentThreats, setRecentThreats] = useState<ThreatEvent[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [twinDataMap, setTwinDataMap] = useState<Record<string, TwinData>>({});
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  // Real-time charting data
  const [networkData, setNetworkData] = useState<any[]>([]);

  useEffect(() => {
    // Poll data
    const fetchData = () => {
      threatService.getRecentThreats(15).then(res => setRecentThreats(res.items)).catch(console.error);
      incidentService.getIncidents('OPEN').then(res => setIncidents(res)).catch(console.error);
      api.get('/alerts/?status=open').then(res => setAlerts(res.data)).catch(console.error);
      
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

  useTwinWebSocket(null, (twin) => {
    setTwinDataMap(prev => ({
      ...prev,
      [twin.device_id]: twin,
    }));
    if ((twin as any).telemetry) {
        setNetworkData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            tx: (twin as any).telemetry.network_tx_bytes_sec || 0,
            rx: (twin as any).telemetry.network_rx_bytes_sec || 0
          };
          return [...prev.slice(-19), newPoint]; // Keep last 20 points
        });
    }
  }, (threat) => {
    setRecentThreats(prev => [threat, ...prev].slice(0, 15));
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
    const criticalThreats = recentThreats.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH').length;
    return { total, active, threats: criticalThreats };
  }, [devices, twinDataMap, recentThreats]);

  const getThreatLabel = (t: ThreatEvent) => {
    if (t.detection_type.includes('ai_prediction')) return 'AI CLASSIFICATION';
    if (t.detection_type.includes('anomaly_detection')) return 'ANOMALY';
    if (t.detection_type.includes('rule_based')) return 'SECURITY RULE';
    return 'THREAT';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', overflow: 'hidden' }}>
      
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={28} color="#22d3ee" />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              SOC Command Center
            </h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
              LIVE TELEMETRY STREAM
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <StatBox label="Total Endpoints" value={stats.total} icon={<Server size={16} />} color="#22d3ee" />
          <StatBox label="Active Agents" value={stats.active} icon={<Activity size={16} />} color="#22c55e" />
          <StatBox label="Open Incidents" value={incidents.length} icon={<Shield size={16} />} color="#f97316" />
          <StatBox label="Open Alerts" value={alerts.length} icon={<Bell size={16} />} color="#eab308" />
          <StatBox label="Critical Threats" value={stats.threats} icon={<AlertTriangle size={16} />} color="#ef4444" />
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>
        
        {/* Left: 3D Twin & Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
             <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
               Global Network Topology
             </h2>
             <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
               Real-time digital twin rendering
             </p>
          </div>
          
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)' }}>
            <DigitalTwinScene nodes={twinNodes.length > 0 ? twinNodes : undefined} />
          </div>
          
          {/* Bottom Panel (Live Charts) */}
          <div style={{ height: '220px', borderTop: '1px solid var(--color-border)', padding: '1rem', display: 'flex', gap: '1rem', backgroundColor: 'var(--color-bg-secondary)' }}>
            <div style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: 8, padding: '1rem', background: 'var(--color-bg-primary)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network size={14} /> Live Network Traffic (Bytes/sec)
              </h3>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkData}>
                    <defs>
                      <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={10} tick={{fill: 'var(--color-text-muted)'}} />
                    <YAxis stroke="var(--color-text-secondary)" fontSize={10} tickFormatter={(val) => `${(val/1024).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="tx" stroke="#22d3ee" fillOpacity={1} fill="url(#colorTx)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="rx" stroke="#818cf8" fillOpacity={1} fill="url(#colorRx)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Threat Feed */}
        <div style={{ backgroundColor: 'var(--color-bg-secondary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
             <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <AlertTriangle size={18} color="var(--color-error)" /> Live Threat Feed
             </h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentThreats.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                No active threats detected.
              </div>
            ) : recentThreats.map((threat) => (
              <div key={threat.id} style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg-primary)',
                borderLeft: `3px solid ${threat.severity === 'CRITICAL' ? 'var(--color-error)' : threat.severity === 'HIGH' ? 'var(--color-warn)' : 'var(--color-accent)'}`,
                borderRadius: '0 4px 4px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                animation: 'fade-in 0.5s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid var(--color-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{threat.threat_category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{new Date(threat.detected_at).toLocaleTimeString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px', color: 'var(--color-text-primary)' }}>
                    {getThreatLabel(threat)}
                  </span>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', backgroundColor: 'var(--color-error-muted)', color: 'var(--color-error)', borderRadius: '4px' }}>
                    RISK SCORE: {threat.risk_score.toFixed(1)}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                  Target: {threat.device_id.split('-')[0]}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  {threat.description}
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
      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
