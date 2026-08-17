export interface Alert {
  id: string;
  organization_id: string;
  device_id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  metric_value: number;
  threshold_value: number;
  status: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertListResponse {
  items: Alert[];
  total: number;
}
