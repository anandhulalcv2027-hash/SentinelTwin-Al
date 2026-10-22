import api from '@/lib/api';

export interface ThreatEvent {
  id: string;
  device_id: string;
  organization_id: string;
  source: string;
  detection_type: string;
  threat_category?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  status: string;
  classifier_info?: Record<string, any>;
  anomaly_info?: Record<string, any>;
  rule_info?: Record<string, any>;
  evidence_context?: Record<string, any>;
  description?: string;
  detected_at: string;
  device_name?: string;
}

export interface ThreatEventListResponse {
  items: ThreatEvent[];
  total: number;
}

export const threatService = {
  /**
   * GET /api/v1/threats
   */
  async getRecentThreats(limit: number = 10): Promise<ThreatEventListResponse> {
    const { data } = await api.get<ThreatEventListResponse>(`/api/v1/threats?limit=${limit}`);
    return data;
  },
};
