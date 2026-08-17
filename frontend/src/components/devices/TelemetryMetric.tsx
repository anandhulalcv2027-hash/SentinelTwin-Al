export function TelemetryMetric({ label, valuePercent }: { label: string; valuePercent: number }) {
  const percent = Math.min(100, Math.max(0, valuePercent));
  
  let bgColor = 'var(--color-success)';
  if (percent > 85) {
    bgColor = 'var(--color-danger)';
  } else if (percent > 70) {
    bgColor = 'var(--color-warn)';
  } else {
    bgColor = 'var(--color-success)';
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
          {percent.toFixed(1)}%
        </span>
      </div>
      <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent}%`, backgroundColor: bgColor, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}
