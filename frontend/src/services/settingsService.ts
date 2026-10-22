import api from '@/lib/api';

export interface SettingsUpdate {
  settings: Record<string, any>;
}

export const settingsService = {
  /**
   * GET /api/v1/settings
   */
  async getSettings(): Promise<{ settings: Record<string, any> }> {
    const { data } = await api.get<{ settings: Record<string, any> }>('/api/v1/settings');
    return data;
  },

  /**
   * PUT /api/v1/settings
   */
  async updateSettings(payload: SettingsUpdate): Promise<{ settings: Record<string, any>; message: string }> {
    const { data } = await api.put<{ settings: Record<string, any>; message: string }>('/api/v1/settings', payload);
    return data;
  },
};
