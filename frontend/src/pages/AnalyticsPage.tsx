import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Activity } from 'lucide-react';

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [deviceId, setDeviceId] = useState<string>('');

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await api.get('/devices');
      return res.data.items;
    }
  });

  const { data: telemetry, isLoading } = useQuery({
    queryKey: ['analytics', 'telemetry', deviceId, dateRange],
    queryFn: async () => {
      if (!deviceId || !dateRange?.from || !dateRange?.to) return [];
      const res = await api.get('/analytics/telemetry', {
        params: {
          device_id: deviceId,
          start_time: dateRange.from.toISOString(),
          end_time: dateRange.to.toISOString()
        }
      });
      return res.data;
    },
    enabled: !!deviceId && !!dateRange?.from && !!dateRange?.to
  });

  const chartData = telemetry?.map((item: any) => ({
    ...item,
    timestamp: item.timestamp || item.collected_at,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in" style={{ padding: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div style={{ padding: '0.6rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-accent)' }}>
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] m-0">Historical Analytics</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Analyze endpoint performance and telemetry trends</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={deviceId} onValueChange={setDeviceId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Device" />
            </SelectTrigger>
            <SelectContent>
              {devices?.map((d: any) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="premium-panel st-card" style={{ padding: '1.5rem' }}>
          <div className="mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
            <Activity size={18} className="text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold m-0 text-[var(--color-text-primary)]">CPU & Memory Utilization History</h2>
          </div>
          <div className="h-[400px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">Loading...</div>
            ) : !chartData.length ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data for selected period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="var(--color-text-secondary)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    labelStyle={{ color: 'var(--color-text-secondary)' }}
                    itemStyle={{ color: 'var(--color-accent)' }}
                    labelFormatter={(label: any) => new Date(label as string | number).toLocaleString()} 
                  />
                  <Area type="monotone" dataKey="memory_usage_percent" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" name="Memory %" isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
