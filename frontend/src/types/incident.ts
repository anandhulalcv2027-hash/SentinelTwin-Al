export enum IncidentStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Incident {
  id: string;
  organization_id: string;
  device_id: string;
  source_alert_id?: string;
  source_threat_event_id?: string;
  assigned_user_id?: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  investigation_notes?: any[];
  resolution_information?: string;
  created_at: string;
  updated_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface IncidentCreate {
  organization_id: string;
  device_id: string;
  source_alert_id?: string;
  source_threat_event_id?: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
}

export interface IncidentUpdate {
  title?: string;
  description?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  assigned_user_id?: string;
  investigation_notes?: any[];
  resolution_information?: string;
}
