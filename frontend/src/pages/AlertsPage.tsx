import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  Monitor,
  Check,
} from 'lucide-react';
import { alertService, handleAlertError } from '@/services/alertService';
import { deviceService } from '@/services/deviceService';
import type { Alert } from '@/types/alert';
import type { Device } from '@/types/device';
import { parseBackendTimestamp } from '@/lib/dateUtils';

type FilterType = 'all' | 'open' | 'resolved';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [devices, setDevices] = useState<Record<string, Device>>({});
  const [loading, setLoading] = useState(true);
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setBackgroundRefreshing(true);
    
    setErrorMsg('');
    
    try {
      const [alertsRes, devicesRes] = await Promise.all([
        alertService.getAlerts(),
        deviceService.getDevices().catch(() => ({ items: [], total: 0 }))
      ]);
      
      setAlerts(alertsRes.items);
      
      const deviceMap: Record<string, Device> = {};
      devicesRes.items.forEach(d => {
        deviceMap[d.id] = d;
      });
      setDevices(deviceMap);
    } catch (err) {
      setErrorMsg(handleAlertError(err));
    } finally {
      if (!isBackground) setLoading(false);
      setBackgroundRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleResolve = async (id: string) => {
    try {
      await alertService.resolveAlert(id);
      fetchData(true); // refresh silently
    } catch (err) {
      setErrorMsg(handleAlertError(err));
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = parseBackendTimestamp(dateString);
    if (!date) return '-';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getSeverityBadge = (alert: Alert) => {
    if (alert.status === 'resolved') {
      return (
        <span className="st-badge-healthy">
          <CheckCircle2 size={12} /> Resolved
        </span>
      );
    }
    if (alert.severity === 'critical' || alert.severity === 'error') {
      return (
        <span className="st-badge-danger">
          <AlertCircle size={12} /> Open
        </span>
      );
    }
    return (
      <span className="st-badge-warn">
        <AlertCircle size={12} /> Open
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <AlertTriangle size={24} color="var(--color-warn)" />
            Alerts
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Monitor endpoint alerts and system anomalies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {backgroundRefreshing && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Loader2 size={12} className="animate-spin" />
              Refreshing...
            </span>
          )}
          <button onClick={() => fetchData()} className="st-btn-ghost" disabled={loading || backgroundRefreshing}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(248, 81, 73, 0.08)',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            color: 'var(--color-danger)',
            fontSize: '0.83rem',
            lineHeight: 1.5,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: filter === f ? 'var(--color-bg-elevated)' : 'transparent',
              border: '1px solid',
              borderColor: filter === f ? 'var(--color-border)' : 'transparent',
              borderRadius: 'var(--radius-xl)',
              color: filter === f ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="st-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && alerts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            Loading alerts...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              {alerts.length === 0 ? 'No alerts found.' : `No ${filter} alerts found.`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-overlay)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Alert</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Device</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Metric</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map(alert => {
                  const isResolved = alert.status === 'resolved';
                  const device = devices[alert.device_id];
                  
                  return (
                    <tr 
                      key={alert.id} 
                      style={{ 
                        borderBottom: '1px solid var(--color-border-subtle)',
                        opacity: isResolved ? 0.7 : 1,
                        backgroundColor: isResolved ? 'transparent' : 'rgba(210, 153, 34, 0.03)'
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        {getSeverityBadge(alert)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
                          {alert.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {alert.message}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-primary)' }}>
                          <Monitor size={14} color="var(--color-text-muted)" />
                          {device ? device.name : alert.device_id.substring(0, 8)}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: 'var(--color-text-primary)' }}>
                          {alert.metric_value != null ? `${alert.metric_value.toFixed(1)}%` : '-'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          Threshold: {alert.threshold_value != null ? `${alert.threshold_value}%` : '-'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <div style={{ whiteSpace: 'nowrap' }}>Created: {formatDate(alert.created_at)}</div>
                        {isResolved && <div style={{ whiteSpace: 'nowrap' }}>Resolved: {formatDate(alert.resolved_at)}</div>}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {!isResolved && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="st-btn-ghost"
                            style={{ padding: '0.4rem', border: 'none', color: 'var(--color-success)' }}
                            title="Resolve Alert"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
