import { useState, useEffect, useMemo } from 'react';
import {
  Monitor,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  Activity,
  ServerOff,
  Wifi,
} from 'lucide-react';
import { deviceService, handleDeviceError } from '@/services/deviceService';
import type { Device } from '@/types/device';
import { getDeviceStatus } from '@/lib/dateUtils';

import { DeviceTable } from '@/components/devices/DeviceTable';
import { DeviceRegistrationDialog } from '@/components/devices/DeviceRegistrationDialog';
import { DeviceEditDialog } from '@/components/devices/DeviceEditDialog';
import { DeleteDeviceDialog } from '@/components/devices/DeleteDeviceDialog';
import { HeartbeatTokenDialog } from '@/components/devices/HeartbeatTokenDialog';

export function EndpointsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Banner notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);
  const [heartbeatData, setHeartbeatData] = useState<{token: string, name: string} | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await deviceService.getDevices();
      setDevices(response.items);
    } catch (err) {
      setErrorMsg(handleDeviceError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const summary = useMemo(() => {
    const total = devices.length;
    const active = devices.filter(d => d.is_active).length;
    const inactive = total - active;
    
    let onlineOrRecent = 0;
    devices.forEach(d => {
      const status = getDeviceStatus(d.last_seen);
      if (status === 'online' || status === 'recently') {
        onlineOrRecent++;
      }
    });

    return { total, active, inactive, onlineOrRecent };
  }, [devices]);

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
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
            <Monitor size={24} color="var(--color-accent)" />
            Devices
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage endpoints, device credentials, health, and connectivity.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchDevices} className="st-btn-ghost" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="st-btn-primary">
            <Plus size={16} />
            Register Device
          </button>
        </div>
      </div>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
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

      {successMsg && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(63, 185, 80, 0.08)',
            border: '1px solid rgba(63, 185, 80, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            color: 'var(--color-success)',
            fontSize: '0.83rem',
            lineHeight: 1.5,
          }}
        >
          <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="st-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)' }}>
            <Monitor size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Devices</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{summary.total}</div>
          </div>
        </div>

        <div className="st-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(63, 185, 80, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Devices</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{summary.active}</div>
          </div>
        </div>

        <div className="st-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(248, 81, 73, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)' }}>
            <ServerOff size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inactive Devices</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{summary.inactive}</div>
          </div>
        </div>

        <div className="st-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(34, 211, 238, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent)' }}>
            <Wifi size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Online / Recent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{summary.onlineOrRecent}</div>
          </div>
        </div>
      </div>

      {/* ── Devices List ──────────────────────────────────────────────────── */}
      <div className="st-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && devices.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            Loading devices...
          </div>
        ) : devices.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Monitor size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No devices registered yet.</p>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Register your first endpoint to start monitoring device health.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="st-btn-outline">
              <Plus size={15} /> Register Device
            </button>
          </div>
        ) : (
          <DeviceTable
            devices={devices}
            onEdit={setEditingDevice}
            onDelete={setDeletingDevice}
          />
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .st-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(2px);
          padding: 1rem;
        }
      `}</style>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <DeviceRegistrationDialog
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(token, name) => {
            setIsAddModalOpen(false);
            showSuccess('Device registered successfully.');
            setHeartbeatData({ token, name });
            fetchDevices();
          }}
        />
      )}

      {editingDevice && (
        <DeviceEditDialog
          device={editingDevice}
          onClose={() => setEditingDevice(null)}
          onSuccess={() => {
            setEditingDevice(null);
            showSuccess('Device updated successfully.');
            fetchDevices();
          }}
        />
      )}

      {deletingDevice && (
        <DeleteDeviceDialog
          device={deletingDevice}
          onClose={() => setDeletingDevice(null)}
          onSuccess={() => {
            setDeletingDevice(null);
            showSuccess('Device deleted successfully.');
            fetchDevices();
          }}
        />
      )}

      {heartbeatData && (
        <HeartbeatTokenDialog
          token={heartbeatData.token}
          deviceName={heartbeatData.name}
          onClose={() => setHeartbeatData(null)}
        />
      )}
    </div>
  );
}
