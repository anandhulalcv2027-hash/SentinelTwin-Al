import { useState, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Search,
  RefreshCw,
  Server,
  CheckCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService';
import { Incident, IncidentStatus, IncidentSeverity } from '../types/incident';

export const IncidentsPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: incidents, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['incidents', filterStatus],
    queryFn: () => incidentService.getIncidents(filterStatus === 'ALL' ? undefined : filterStatus),
    refetchInterval: 10000, // auto-refresh every 10s
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Incident> }) =>
      incidentService.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  const handleStatusChange = (incident: Incident, newStatus: IncidentStatus) => {
    updateMutation.mutate({ id: incident.id, data: { status: newStatus } });
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const list = incidents || [];
    const total = list.length;
    const active = list.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;
    const critical = list.filter(i => i.severity === 'CRITICAL').length;
    const resolved = list.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
    return { total, active, critical, resolved };
  }, [incidents]);

  // Filtered List
  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    return incidents.filter(i => {
      const matchSeverity = filterSeverity === 'ALL' || i.severity === filterSeverity;
      const matchSearch =
        !searchQuery ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.description && i.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.device_id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [incidents, filterSeverity, searchQuery]);

  const getSeverityStyle = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          border: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          glow: '0 0 15px rgba(239, 68, 68, 0.25)',
        };
      case 'HIGH':
        return {
          border: '#f97316',
          bg: 'rgba(249, 115, 22, 0.15)',
          color: '#f97316',
          glow: '0 0 10px rgba(249, 115, 22, 0.2)',
        };
      case 'MEDIUM':
        return {
          border: '#eab308',
          bg: 'rgba(234, 179, 8, 0.15)',
          color: '#eab308',
          glow: 'none',
        };
      default:
        return {
          border: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          glow: 'none',
        };
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '#ef4444' };
      case 'INVESTIGATING':
        return { bg: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '#06b6d4' };
      case 'ACKNOWLEDGED':
        return { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '#eab308' };
      case 'RESOLVED':
        return { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '#22c55e' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '#64748b' };
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#f8fafc', minHeight: '100%' }}>
      
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)', 
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
          }}>
            <ShieldAlert size={26} color="#ef4444" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Incident Response Center
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
              Real-time threat triage, digital forensic investigation & automated containment
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            padding: '0.6rem 1rem',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* ── Executive KPI Metric Cards ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <KpiCard
          title="Total Incidents"
          value={stats.total}
          subtitle="All recorded events"
          icon={<FileText size={20} color="#06b6d4" />}
          color="#06b6d4"
        />
        <KpiCard
          title="Active & Investigating"
          value={stats.active}
          subtitle="Requires analyst attention"
          icon={<Activity size={20} color="#f97316" />}
          color="#f97316"
          pulse={stats.active > 0}
        />
        <KpiCard
          title="Critical Breaches"
          value={stats.critical}
          subtitle="Immediate containment priority"
          icon={<Flame size={20} color="#ef4444" />}
          color="#ef4444"
          pulse={stats.critical > 0}
        />
        <KpiCard
          title="Resolved & Contained"
          value={stats.resolved}
          subtitle="Threats successfully neutralized"
          icon={<ShieldCheck size={20} color="#22c55e" />}
          color="#22c55e"
        />
      </div>

      {/* ── Incident Controls Toolbar ────────────────────────────────────────── */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.65)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        borderRadius: 12, 
        padding: '1rem', 
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['ALL', 'OPEN', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                background: filterStatus === status ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                border: filterStatus === status ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                color: filterStatus === status ? '#ffffff' : '#94a3b8',
                borderRadius: 8,
                padding: '0.4rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Severity Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '0.45rem 0.75rem',
              color: '#f8fafc',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search title, device, or clue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                color: '#f8fafc',
                fontSize: '0.78rem',
                outline: 'none',
                minWidth: '220px'
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Incidents List ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: '#94a3b8' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.4)', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: 12, 
          padding: '4rem 2rem', 
          textAlign: 'center',
          color: '#64748b'
        }}>
          <ShieldCheck size={48} color="#22c55e" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            No Incidents Found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
            There are currently no security incidents matching your selected filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredIncidents.map((incident) => {
            const sevStyle = getSeverityStyle(incident.severity);
            const statusBadge = getStatusBadge(incident.status);
            const isExpanded = expandedIncidentId === incident.id;

            return (
              <div 
                key={incident.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderLeft: `5px solid ${sevStyle.border}`,
                  borderRadius: 12,
                  boxShadow: sevStyle.glow,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Incident Card Top Header */}
                <div style={{ 
                  padding: '1.25rem', 
                  borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {incident.title}
                      </h3>
                      
                      {/* Severity Badge */}
                      <span style={{
                        backgroundColor: sevStyle.bg,
                        color: sevStyle.color,
                        border: `1px solid ${sevStyle.border}60`,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        letterSpacing: '0.04em'
                      }}>
                        {incident.severity}
                      </span>

                      {/* Status Badge */}
                      <span style={{
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        border: `1px solid ${statusBadge.border}60`,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6
                      }}>
                        {incident.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                      <span>TICKET: #{incident.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>CREATED: {new Date(incident.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span style={{ color: '#06b6d4' }}>NODE: {incident.device_id.slice(0, 13)}...</span>
                    </div>
                  </div>

                  {/* Quick Status Workflow Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {incident.status === 'OPEN' && (
                      <button
                        onClick={() => handleStatusChange(incident, IncidentStatus.INVESTIGATING)}
                        style={{
                          background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: 6,
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Activity size={13} />
                        <span>Start Investigation</span>
                      </button>
                    )}

                    {(incident.status === 'OPEN' || incident.status === 'INVESTIGATING' || incident.status === 'ACKNOWLEDGED') && (
                      <button
                        onClick={() => handleStatusChange(incident, IncidentStatus.RESOLVED)}
                        style={{
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          color: '#22c55e',
                          borderRadius: 6,
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <CheckCircle size={13} />
                        <span>Resolve</span>
                      </button>
                    )}

                    {incident.status === 'RESOLVED' && (
                      <button
                        onClick={() => handleStatusChange(incident, IncidentStatus.CLOSED)}
                        style={{
                          background: 'rgba(148, 163, 184, 0.15)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          color: '#94a3b8',
                          borderRadius: 6,
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Close Ticket
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedIncidentId(isExpanded ? null : incident.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#94a3b8',
                        borderRadius: 6,
                        padding: '0.45rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Toggle Forensic Breakdown"
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* Primary Description & Forensic Highlights */}
                <div style={{ padding: '1rem 1.25rem', background: 'rgba(0, 0, 0, 0.2)' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {incident.description || 'Automated high-risk correlation alert escalated to Incident response.'}
                  </p>
                </div>

                {/* Expandable Forensic Deep-Dive Drawer */}
                {isExpanded && (
                  <div style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(10, 15, 26, 0.95)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      
                      {/* Investigation Notes & Recommendations */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8, padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Shield size={14} /> Recommended Response Playbook
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
                          <li>Isolate endpoint from local network segment to prevent lateral movement.</li>
                          <li>Inspect process tree and outbound connection sockets.</li>
                          <li>Invalidate active user session tokens and enforce credential rotation.</li>
                          <li>Verify whether anomalous egress traffic contains sensitive organizational assets.</li>
                        </ul>
                      </div>

                      {/* Technical Forensic Context */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8, padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Server size={14} /> Telemetry Evidence Metadata
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                          <div>TARGET_DEVICE: {incident.device_id}</div>
                          <div>ESCALATED_FROM: {incident.source_alert_id ? 'Security Alert' : 'Threat Engine Score'}</div>
                          <div>INCIDENT_STATUS: {incident.status}</div>
                          <div>LAST_UPDATED: {new Date(incident.updated_at).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function KpiCard({ title, value, subtitle, icon, color, pulse }: { title: string; value: number; subtitle: string; icon: React.ReactNode; color: string; pulse?: boolean }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>

      <div style={{ margin: '0.75rem 0 0.25rem 0' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
          {value}
        </span>
      </div>

      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {pulse && (
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
