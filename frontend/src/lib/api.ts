import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { tokenStore } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

function processQueue(
  error: unknown,
  token: string | null,
): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
}

// Attach the current access token.
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

// Handle expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    const status = error.response?.status;

    // Only refresh on 401 responses.
    // Never try to refresh the refresh request itself.
    if (
      status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/login')
    ) {
      normalizeError(error);
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefreshToken();

    if (!refreshToken) {
      tokenStore.clear();
      normalizeError(error);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      /*
       * Use a separate axios request here.
       *
       * This prevents the refresh request from entering
       * the same interceptor and creating a refresh loop.
       */
      const refreshResponse = await axios.post<{
        access_token: string;
        refresh_token: string;
        token_type: string;
      }>(
        `${BASE_URL}/api/v1/auth/refresh`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const {
        access_token,
        refresh_token,
      } = refreshResponse.data;

      tokenStore.setTokens(
        access_token,
        refresh_token,
      );

      processQueue(null, access_token);

      originalRequest.headers.Authorization =
        `Bearer ${access_token}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      tokenStore.clear();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Normalise FastAPI error messages.
function normalizeError(
  error: AxiosError,
): void {
  if (error.response?.data) {
    const detail = (
      error.response.data as {
        detail?: unknown;
      }
    ).detail;

    if (typeof detail === 'string') {
      error.message = detail;
    } else if (
      Array.isArray(detail) &&
      detail.length > 0
    ) {
      error.message = detail
        .map((item) => {
          if (
            typeof item === 'object' &&
            item !== null &&
            'msg' in item
          ) {
            return String(
              (item as { msg: unknown }).msg,
            );
          }

          return String(item);
        })
        .join(', ');
    }
  }
}

export default api;