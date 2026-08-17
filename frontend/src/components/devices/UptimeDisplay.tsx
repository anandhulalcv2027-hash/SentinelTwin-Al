import { formatUptime } from '@/lib/format';

export function UptimeDisplay({ seconds }: { seconds: number }) {
  return <span>{formatUptime(seconds)}</span>;
}
