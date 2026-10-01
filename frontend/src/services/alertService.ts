import api from '@/lib/api';
import type { Alert, AlertListResponse } from '@/types/alert';
import { AxiosError } from 'axios';

const ALERTS_PREFIX = '/api/v1/alerts';

export function handleAlertError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401) return 'Session expired or authentication failed. Please sign in again.';
    if (status === 403) return 'Permission denied. You do not have access to view alerts.';
    if (status && status >= 500) return 'An internal server error occurred. Please try again later.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export const alertService = {
  async getAlerts(): Promise<AlertListResponse> {
    const { data } = await api.get<AlertListResponse>(ALERTS_PREFIX);
    return data;
  },
  
  async resolveAlert(id: string): Promise<Alert> {
    const { data } = await api.post<Alert>(`${ALERTS_PREFIX}/${id}/resolve`);
    return data;
  },
};
