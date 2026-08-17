export interface Device {
  id: string;
  organization_id: string;
  name: string;
  device_identifier: string;
  description: string | null;
  device_type: string;
  is_active: boolean;
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
  agent_version: string;
  collected_at: string;
}
