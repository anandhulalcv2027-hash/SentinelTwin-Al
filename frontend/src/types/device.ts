export interface Device {
  id: string;
  organization_id: string;
  name: string;
  device_identifier: string;
  description: string | null;
  device_type: string;
  is_active: boolean;
  is_isolated: boolean;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceListResponse {
  items: Device[];
  total: number;
}

export interface DeviceCreateRequest {
  name: string;
  device_identifier: string;
  description?: string | null;
  device_type?: string;
}

export interface DeviceCreateResponse {
  device: Device;
  heartbeat_token: string;
}

export interface DeviceUpdateRequest {
  name?: string | null;
  description?: string | null;
  device_type?: string | null;
  is_active?: boolean | null;
}

export interface DeviceTelemetry {
  id: string;
  device_id: string;
  hostname: string;
  operating_system: string;
  os_version: string;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  disk_usage_percent: number;
  uptime_seconds: number;
  network_bytes_sent: number;
  network_bytes_recv: number;
  active_connections: number;
  process_count: number;
  failed_logins: number;
  agent_version: string;
  collected_at: string;
}

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'none';

export interface DeviceLiveState {
  cpu_usage_percent: number;
  memory_usage_percent: number;
  disk_usage_percent: number;
  network_bytes_sent: number;
  network_bytes_recv: number;
  active_connections: number;
  process_count: number;
  failed_logins: number;
  last_updated: string;
}

export interface TwinData {
  device_id: string;
  is_isolated: boolean;
  health_status: HealthStatus;
  risk_level: RiskLevel;
  state_last_updated: string | null;
  live_state: DeviceLiveState | null;
}
