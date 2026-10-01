import api from '@/lib/api';

export interface ThreatEvent {
  id: string;
  device_id: string;
  device_name: string | null;
  threat_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string | null;
  detected_at: string;
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
