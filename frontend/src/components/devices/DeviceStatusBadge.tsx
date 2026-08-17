import { useMemo } from 'react';
import { getDeviceStatus } from '@/lib/dateUtils';

interface DeviceStatusBadgeProps {
  lastSeen: string | null;
}

export function DeviceStatusBadge({ lastSeen }: DeviceStatusBadgeProps) {
  const { status, label, className } = useMemo(() => {
    const s = getDeviceStatus(lastSeen);

    if (s === 'online') {
      return { status: 'online', label: 'Online', className: 'st-badge-healthy' };
    } else if (s === 'recently') {
      return { status: 'recently', label: 'Recently seen', className: 'st-badge-warn' };
    } else if (s === 'offline') {
      return { status: 'offline', label: 'Offline', className: 'st-badge-danger' };
    } else {
      return { status: 'never', label: 'Never connected', className: '' };
    }
  }, [lastSeen]);

  if (status === 'never') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.4 }} />
        {label}
      </span>
    );
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
      {label}
    </span>
  );
}
