import {
  AlertTriangle,
  Activity,
  Server,
  Network,
  Shield,
  Bell,
  Radio,
  Search,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Clock,
  Terminal,
  CheckCircle2,
  AlertOctagon,
  Eye
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [recentThreats, setRecentThreats] = useState<ThreatEvent[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [twinDataMap, setTwinDataMap] = useState<Record<string, TwinData>>({});
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Filter & Search states for the threat stream
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [liveClock, setLiveClock] = useState(new Date().toUTCString());

  // Real-time network telemetry chart
  const [networkData, setNetworkData] = useState<any[]>([
    { time: '00:00:00', tx: 250, rx: 600 },
    { time: '00:00:05', tx: 420, rx: 800 },
    { time: '00:00:10', tx: 310, rx: 750 },
    { time: '00:00:15', tx: 890, rx: 1100 },
    { time: '00:00:20', tx: 650, rx: 900 },
  ]);

  // Live clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [threatsRes, incidentsRes, alertsRes, devicesRes] = await Promise.allSettled([
        threatService.getRecentThreats(30),
        incidentService.getIncidents(),
        api.get('/api/v1/alerts'),
        deviceService.getDevices(),
      ]);

      if (threatsRes.status === 'fulfilled' && threatsRes.value?.items) {
        setRecentThreats(threatsRes.value.items);
      }
      if (incidentsRes.status === 'fulfilled' && incidentsRes.value) {
        setIncidents(incidentsRes.value);
      }
      if (alertsRes.status === 'fulfilled') {
        const rawAlerts = alertsRes.value.data?.items || alertsRes.value.data || [];
        setAlerts(Array.isArray(rawAlerts) ? rawAlerts : []);
      }
      if (devicesRes.status === 'fulfilled' && devicesRes.value?.items) {
        const devList = devicesRes.value.items;
        setDevices(devList);
        if (devList.length > 0 && !selectedDevice) {
          setSelectedDevice(devList[0]);
        }

        // Fetch twin states
        Promise.all(
          devList.map(d => deviceService.getDeviceTwin(d.id).catch(() => null))
        ).then(results => {
          const newMap: Record<string, TwinData> = {};
          results.forEach(res => {
            if (res) newMap[res.device_id] = res;
          });
          setTwinDataMap(prev => ({ ...prev, ...newMap }));
        });
      }
    } catch (e) {
      console.error('Failed to load SOC data', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // 8s poll for high freshness
    return () => clearInterval(interval);
  }, []);

  useTwinWebSocket(
    null,
    (twin) => {
      setTwinDataMap(prev => ({
        ...prev,
        [twin.device_id]: twin,
      }));
      if ((twin as any).telemetry) {
        const tel = (twin as any).telemetry;
        setNetworkData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            tx: tel.network_bytes_sent ? Math.round(tel.network_bytes_sent / 1024) : 100,
            rx: tel.network_bytes_recv ? Math.round(tel.network_bytes_recv / 1024) : 300,
          };
          return [...prev.slice(-19), newPoint];
        });
      }
    },
    (threat) => {
      setRecentThreats(prev => [threat, ...prev].slice(0, 30));
    }
  );

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
    const criticalThreats = recentThreats.filter(t => t.severity === 'CRITICAL').length;
    const highThreats = recentThreats.filter(t => t.severity === 'HIGH').length;
    const openIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;

    return { total, active, criticalThreats, highThreats, openIncidents };
  }, [devices, twinDataMap, recentThreats, incidents]);

  // Filtered threats
  const filteredThreats = useMemo(() => {
    return recentThreats.filter(t => {
      const matchesSeverity = severityFilter === 'ALL' || t.severity === severityFilter;
      const matchesSearch = !searchQuery || 
        (t.threat_category && t.threat_category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.device_id && t.device_id.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSeverity && matchesSearch;
    });
  }, [recentThreats, severityFilter, searchQuery]);

  // Current DEFCON Level
  const defconLevel = useMemo(() => {
    if (stats.criticalThreats > 0) return { level: 1, label: 'DEFCON 1: CRITICAL INVASION', color: '#ef4444', pulse: true };
    if (stats.highThreats > 0 || stats.openIncidents > 0) return { level: 2, label: 'DEFCON 2: ELEVATED THREAT', color: '#f97316', pulse: true };
    if (recentThreats.length > 0) return { level: 3, label: 'DEFCON 3: ACTIVE MONITORING', color: '#eab308', pulse: false };
    return { level: 5, label: 'DEFCON 5: SYSTEMS NORMAL', color: '#10b981', pulse: false };
  }, [stats, recentThreats]);

  const getThreatLabel = (t: ThreatEvent) => {
    if (t.detection_type?.includes('ai_prediction')) return 'AI NEURAL';
    if (t.detection_type?.includes('anomaly_detection')) return 'ANOMALY';
    if (t.detection_type?.includes('rule_based')) return 'SECURITY RULE';
    return 'CORRELATED';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#090a0f', color: '#f1f5f9', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
      
      {/* ── Cyber Command HUD Header ────────────────────────────────────────── */}
      <header style={{ 
        padding: '0.85rem 1.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(90deg, #0d1117 0%, #111827 50%, #0d1117 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 20
      }}>
        {/* Brand & Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)', 
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)'
          }}>
            <Radio size={24} color="#06b6d4" className="animate-pulse" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffffff' }}>
                SOC Neural Wall
              </h1>
              {/* Defcon Badge */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                padding: '0.2rem 0.6rem', 
                borderRadius: 20, 
                backgroundColor: `${defconLevel.color}20`, 
                border: `1px solid ${defconLevel.color}60`,
                color: defconLevel.color,
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                <div style={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  backgroundColor: defconLevel.color, 
                  boxShadow: `0 0 8px ${defconLevel.color}` 
                }} />
                {defconLevel.label}
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                <Clock size={12} color="#64748b" /> {liveClock}
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                REAL-TIME TELEMETRY FEED
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right HUD Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <HudStat label="Endpoints" value={stats.total} icon={<Server size={14} />} color="#06b6d4" />
          <HudStat label="Healthy" value={stats.active} icon={<Activity size={14} />} color="#22c55e" />
          <HudStat label="Incidents" value={stats.openIncidents} icon={<Shield size={14} />} color="#f97316" highlight={stats.openIncidents > 0} />
          <HudStat label="Alerts" value={alerts.length} icon={<Bell size={14} />} color="#eab308" />
          <HudStat label="Critical Threats" value={stats.criticalThreats} icon={<Flame size={14} />} color="#ef4444" highlight={stats.criticalThreats > 0} />

          <button 
            onClick={fetchData} 
            disabled={isRefreshing}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              borderRadius: 8, 
              padding: '0.4rem 0.65rem', 
              color: '#94a3b8', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* ── Main SOC Command Grid ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', overflow: 'hidden' }}>
        
        {/* Left Column: 3D Hologram, Endpoint Roster, Live Throughput */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}>
          
          {/* Top 3D Twin Viewport */}
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #101524 0%, #080b12 100%)', minHeight: '380px' }}>
            
            {/* Viewport Top HUD Overlays */}
            <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={14} color="#06b6d4" />
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  Global Digital Twin Matrix
                </h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                Holographic endpoint mesh & behavioral reflection
              </p>
            </div>

            {/* Legend Overlay */}
            <div style={{ 
              position: 'absolute', 
              top: 16, 
              right: 20, 
              zIndex: 10, 
              background: 'rgba(15, 23, 42, 0.75)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: 8, 
              padding: '0.4rem 0.8rem',
              display: 'flex',
              gap: '1rem',
              fontSize: '0.7rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#22c55e' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }} /> Healthy
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} /> Under Attack
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#475569' }} /> Offline
              </span>
            </div>

            {/* The 3D Scene */}
            <DigitalTwinScene nodes={twinNodes.length > 0 ? twinNodes : undefined} />

            {/* Quick Endpoint Selection Strip at Bottom of 3D Scene */}
            <div style={{ 
              position: 'absolute', 
              bottom: 12, 
              left: 16, 
              right: 16, 
              zIndex: 10,
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {devices.map(d => {
                const twin = twinDataMap[d.id];
                const isThreatened = recentThreats.some(t => t.device_id === d.id && (t.severity === 'CRITICAL' || t.severity === 'HIGH'));
                const isSelected = selectedDevice?.id === d.id;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDevice(d)}
                    style={{
                      background: isSelected 
                        ? 'rgba(6, 182, 212, 0.2)' 
                        : 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: isThreatened 
                        ? '1px solid #ef4444' 
                        : isSelected 
                          ? '1px solid #06b6d4' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      padding: '0.45rem 0.75rem',
                      cursor: 'pointer',
                      minWidth: '150px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isThreatened ? '#ef4444' : '#f8fafc' }}>
                        {d.name}
                      </span>
                      <div style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: isThreatened ? '#ef4444' : (twin?.health_status === 'healthy' ? '#22c55e' : '#eab308') 
                      }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {d.device_identifier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower Panel: Live Cyber Throughput Chart & Forensic Telemetry */}
          <div style={{ 
            height: '210px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            padding: '0.85rem 1.25rem', 
            display: 'grid', 
            gridTemplateColumns: 'minmax(0, 1fr) 230px', 
            gap: '1rem', 
            backgroundColor: '#0b0f19' 
          }}>
            {/* Real-time Network Throughput Chart */}
            <div style={{ 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: 10, 
              padding: '0.75rem 1rem', 
              background: 'rgba(15, 23, 42, 0.5)', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <Network size={13} color="#06b6d4" /> Live Egress & Ingress Throughput (KB/s)
                </span>
                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.65rem' }}>
                  <span style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 8, height: 2, backgroundColor: '#06b6d4' }} /> Outbound (TX)
                  </span>
                  <span style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 8, height: 2, backgroundColor: '#818cf8' }} /> Inbound (RX)
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkData}>
                    <defs>
                      <linearGradient id="socTx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="socRx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={9} tick={{fill: '#64748b'}} />
                    <YAxis stroke="#475569" fontSize={9} tickFormatter={(val) => `${val}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', borderRadius: '6px' }} />
                    <Area type="monotone" dataKey="tx" stroke="#06b6d4" fillOpacity={1} fill="url(#socTx)" isAnimationActive={false} strokeWidth={2} />
                    <Area type="monotone" dataKey="rx" stroke="#818cf8" fillOpacity={1} fill="url(#socRx)" isAnimationActive={false} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Selected Node Telemetry HUD */}
            <div style={{ 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: 10, 
              padding: '0.75rem 1rem', 
              background: 'rgba(15, 23, 42, 0.5)', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={13} color="#22c55e" /> Active Node Focus
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>
                  {selectedDevice?.name || 'No Device Selected'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  ID: {selectedDevice?.id ? selectedDevice.id.slice(0, 16) + '...' : 'N/A'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '0.4rem 0' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.4rem 0.5rem', borderRadius: 6 }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>HEALTH</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22c55e' }}>
                    {selectedDevice ? (twinDataMap[selectedDevice.id]?.health_status?.toUpperCase() || 'ONLINE') : '—'}
                  </div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.4rem 0.5rem', borderRadius: 6 }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>STATUS</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4' }}>
                    {selectedDevice?.is_isolated ? 'ISOLATED' : 'ACTIVE'}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/app/incidents')}
                style={{ 
                  background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '0.4rem', 
                  color: '#ffffff', 
                  fontSize: '0.72rem', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>View Incident Response</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Velocity Live SOC Threat Feed */}
        <div style={{ backgroundColor: '#0d111b', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Feed Header */}
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#111624' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#ef4444" />
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Live Threat Interceptions
                </h2>
              </div>
              <span style={{ 
                fontSize: '0.68rem', 
                padding: '0.15rem 0.5rem', 
                borderRadius: 12, 
                backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                color: '#ef4444', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 700 
              }}>
                {filteredThreats.length} Active
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.65rem' }}>
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  style={{
                    flex: 1,
                    padding: '0.25rem 0.4rem',
                    borderRadius: 6,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: severityFilter === sev ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: severityFilter === sev ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                    color: severityFilter === sev ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <Search size={13} color="#64748b" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Filter vector, keyword, or node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6,
                  padding: '0.35rem 0.5rem 0.35rem 1.8rem',
                  fontSize: '0.72rem',
                  color: '#f8fafc',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Threat Cards Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredThreats.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={32} color="#22c55e" />
                <span>Zero threats detected matching criteria.</span>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>Run simulation to observe live vector interception</span>
              </div>
            ) : filteredThreats.map((threat) => {
              const isCrit = threat.severity === 'CRITICAL';
              const isHigh = threat.severity === 'HIGH';
              const sevColor = isCrit ? '#ef4444' : isHigh ? '#f97316' : '#eab308';

              return (
                <div 
                  key={threat.id} 
                  style={{
                    padding: '0.85rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderLeft: `4px solid ${sevColor}`,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '0 8px 8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    boxShadow: isCrit ? '0 0 15px rgba(239, 68, 68, 0.12)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Category & Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertOctagon size={14} color={sevColor} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        {threat.threat_category}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {new Date(threat.detected_at).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.62rem', 
                      padding: '0.12rem 0.45rem', 
                      backgroundColor: 'rgba(99, 102, 241, 0.15)', 
                      borderRadius: 4, 
                      color: '#a5b4fc',
                      fontWeight: 700 
                    }}>
                      {getThreatLabel(threat)}
                    </span>
                    <span style={{ 
                      fontSize: '0.62rem', 
                      padding: '0.12rem 0.45rem', 
                      backgroundColor: `${sevColor}20`, 
                      color: sevColor, 
                      borderRadius: 4,
                      fontWeight: 700,
                      border: `1px solid ${sevColor}40`
                    }}>
                      RISK SCORE: {threat.risk_score.toFixed(1)} / 100
                    </span>
                    <span style={{ 
                      fontSize: '0.62rem', 
                      padding: '0.12rem 0.45rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                      borderRadius: 4, 
                      color: '#cbd5e1',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      NODE: {threat.device_id.split('-')[0]}
                    </span>
                  </div>

                  {/* Description / Forensics */}
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4, background: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: 4 }}>
                    {threat.description}
                  </div>

                  {/* Quick Triage Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <button
                      onClick={() => navigate('/app/incidents')}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#cbd5e1',
                        fontSize: '0.68rem',
                        padding: '0.25rem 0.55rem',
                        borderRadius: 4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Eye size={11} />
                      <span>Investigate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function HudStat({ label, value, icon, color, highlight }: { label: string, value: string | number, icon: React.ReactNode, color: string, highlight?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-end',
      padding: '0.2rem 0.6rem',
      borderRadius: 6,
      background: highlight ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
      border: highlight ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent'
    }}>
      <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: highlight ? '#ef4444' : '#f8fafc', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
    </div>
  );
}
