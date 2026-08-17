import api from '@/lib/api';
import type { RoleListResponse } from '@/types/role';
import { AxiosError } from 'axios';

const ROLES_PREFIX = '/api/v1/roles';

export function handleRoleError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    
    if (status === 401) {
      return 'Session expired. Please sign in again.';
    }
    if (status === 403) {
      return 'Permission denied. You do not have access to view roles.';
    }
    if (status && status >= 500) {
      return 'Failed to load roles due to a server error.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Failed to load roles. An unexpected error occurred.';
}

export const roleService = {
  async getRoles(): Promise<RoleListResponse> {
    const { data } = await api.get<RoleListResponse>(ROLES_PREFIX);
    return data;
  },
};
