import api from '@/lib/api';
import type {
  Device,
  DeviceListResponse,
  DeviceCreateRequest,
  DeviceCreateResponse,
  DeviceUpdateRequest,
  DeviceTelemetry,
} from '@/types/device';
import { AxiosError } from 'axios';

const DEVICES_PREFIX = '/api/v1/devices';

/**
 * Handle API errors locally and map HTTP statuses to friendly messages.
 * This ensures we don't expose backend stack traces or internal details.
 */
export function handleDeviceError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 401) {
      return 'Session expired or authentication failed. Please sign in again.';
    }
    if (status === 403) {
      return 'Permission denied. You do not have access to perform this action.';
    }
    if (status === 404) {
      return 'Device not found.';
    }
    if (status === 409) {
      return 'A device with this identifier already exists.';
    }
    if (status === 422) {
      return 'Validation error. Please check your inputs.';
    }
    if (status && status >= 500) {
      return 'An internal server error occurred. Please try again later.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export const deviceService = {
  /**
   * GET /api/v1/devices
   */
  async getDevices(): Promise<DeviceListResponse> {
    const { data } = await api.get<DeviceListResponse>(DEVICES_PREFIX);
    return data;
  },

  /**
   * GET /api/v1/devices/{device_id}
   */
  async getDevice(id: string): Promise<Device> {
    const { data } = await api.get<Device>(`${DEVICES_PREFIX}/${id}`);
    return data;
  },

  /**
   * POST /api/v1/devices
   */
  async createDevice(payload: DeviceCreateRequest): Promise<DeviceCreateResponse> {
    const { data } = await api.post<DeviceCreateResponse>(DEVICES_PREFIX, payload);
    return data;
  },

  /**
   * PATCH /api/v1/devices/{device_id}
   */
  async updateDevice(id: string, payload: DeviceUpdateRequest): Promise<Device> {
    const { data } = await api.patch<Device>(`${DEVICES_PREFIX}/${id}`, payload);
    return data;
  },

  /**
   * DELETE /api/v1/devices/{device_id}
   */
  async deleteDevice(id: string): Promise<void> {
    await api.delete(`${DEVICES_PREFIX}/${id}`);
  },

  /**
 * GET /api/v1/devices/{device_id}/telemetry/latest
 */
  async getDeviceTelemetry(id: string): Promise<DeviceTelemetry> {
    const { data } = await api.get<DeviceTelemetry>(
      `${DEVICES_PREFIX}/${id}/telemetry/latest`,
    );

    return data;
  },
};
