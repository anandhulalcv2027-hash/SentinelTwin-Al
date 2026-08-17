import api from '@/lib/api';
import type {
  User,
  UserListResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/types/user';
import { AxiosError } from 'axios';

const USERS_PREFIX = '/api/v1/users';

export function handleUserError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    
    if (status === 401) {
      return 'Your session has expired. Please sign in again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'User not found.';
    }
    if (status === 409) {
      return 'Another user with this email or username already exists.';
    }
    if (status === 422) {
      return 'Please check the entered information.';
    }
    if (status && status >= 500) {
      return 'Something went wrong on the server. Please try again.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}

export const userService = {
  async getUsers(): Promise<UserListResponse> {
    const { data } = await api.get<UserListResponse>(USERS_PREFIX);
    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get<User>(`${USERS_PREFIX}/${id}`);
    return data;
  },

  async createUser(payload: UserCreateRequest): Promise<User> {
    const { data } = await api.post<User>(USERS_PREFIX, payload);
    return data;
  },

  async updateUser(id: string, payload: UserUpdateRequest): Promise<User> {
    const { data } = await api.patch<User>(`${USERS_PREFIX}/${id}`, payload);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${USERS_PREFIX}/${id}`);
  },
};
