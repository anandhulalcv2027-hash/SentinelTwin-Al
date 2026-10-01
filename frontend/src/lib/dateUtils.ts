export function parseBackendTimestamp(timestamp: string | null | undefined): Date | null {
  if (!timestamp) return null;

  let timeStr = timestamp;
  // If the timestamp doesn't end with 'Z' and doesn't contain a timezone offset like +00:00 or -0500, treat it as UTC
  if (!timeStr.endsWith('Z') && !timeStr.match(/[+-]\d{2}:?\d{2}$/)) {
    timeStr += 'Z';
  }

  const date = new Date(timeStr);
  return isNaN(date.getTime()) ? null : date;
}

export type DeviceStatus = 'online' | 'recently' | 'offline' | 'never';

export function getDeviceStatus(
  lastSeen: string | null | undefined
): DeviceStatus {
  const date = parseBackendTimestamp(lastSeen);

  if (!date) return 'never';

  const diffMinutes =
    (Date.now() - date.getTime()) / (1000 * 60);

  if (diffMinutes <= 2) {
    return 'online';
  } else if (diffMinutes <= 5) {
    return 'recently';
  } else {
    return 'offline';
  }
}
