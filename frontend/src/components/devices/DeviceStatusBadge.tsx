import { useEffect, useState } from 'react';
import { getDeviceStatus } from '@/lib/dateUtils';

interface DeviceStatusBadgeProps {
  lastSeen: string | null;
}

export function DeviceStatusBadge({
  lastSeen,
}: DeviceStatusBadgeProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      forceUpdate((value) => value + 1);
    }, 15_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const status = getDeviceStatus(lastSeen);

  const statusConfig = {
    online: {
      label: 'Online',
      className: 'st-badge-healthy',
    },
    recently: {
      label: 'Recently seen',
      className: 'st-badge-warn',
    },
    offline: {
      label: 'Offline',
      className: 'st-badge-danger',
    },
    never: {
      label: 'Never connected',
      className: '',
    },
  }[status];

  if (status === 'never') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            opacity: 0.4,
          }}
        />
        {statusConfig.label}
      </span>
    );
  }

  return (
    <span
      className={statusConfig.className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
      {statusConfig.label}
    </span>
  );
}