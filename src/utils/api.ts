import Velocity, { type VelocityConfig, type VelocityResponse } from "velocity-http";

export interface ResponseType<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export type { VelocityConfig, VelocityResponse };

/**
 * Default global Velocity HTTP client for universal use
 */
let currentApiClient: any = new Velocity({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    platform: "WEB",
  },
  withCredentials: true,
});

/**
 * Configure or replace the default HTTP client instance
 */
export function setGlobalApiClient(client: any) {
  currentApiClient = client;
}

/**
 * Get the current active API client
 */
export function getGlobalApiClient() {
  return currentApiClient;
}

/**
 * Create a new custom Velocity client with custom configuration
 */
export function createApiClient(config: VelocityConfig = {}) {
  return new Velocity({
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      platform: "WEB",
    },
    withCredentials: true,
    ...config,
  });
}

/**
 * Universal proxy API object that delegates to the current active client
 */
export const api = {
  get: (url: string, config?: VelocityConfig) => currentApiClient.get(url, config),
  post: (url: string, data?: any, config?: VelocityConfig) => currentApiClient.post(url, data, config),
  put: (url: string, data?: any, config?: VelocityConfig) => currentApiClient.put(url, data, config),
  delete: (url: string, config?: VelocityConfig) => currentApiClient.delete(url, config),
  patch: (url: string, data?: any, config?: VelocityConfig) => currentApiClient.patch(url, data, config),
  request: (config: VelocityConfig) => currentApiClient.request(config),
};

export const uploadApi = {
  getPresignedUrl: (data: { filename: string; contentType: string; folder?: string }) =>
    api.post("/api/v1/upload/presigned-url", data),
  verifyUpload: (data: { key: string }) => api.post("/api/v1/upload/verify", data),
  deleteFiles: (keys: string[]) => api.post("/api/v1/upload/delete", { keys }),
  uploadFile: (url: string, formData: FormData, config?: VelocityConfig) => {
    return currentApiClient.post(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
