import axios, { AxiosError } from "axios";

import { messageForErrorCode } from "@/constants/messages";
import type { ApiErrorBody } from "@/types/auth";

/**
 * A normalized shape every API call rejects with, so calling code never has
 * to reach into raw Axios/network error internals.
 */
export interface NormalizedApiError {
  code: string;
  message: string;
  status: number | null;
  isNetworkError: boolean;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // The backend issues the JWT as an HTTP-only cookie — this is what lets
  // the browser actually send/receive it on cross-origin requests.
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Set by AuthProvider so the interceptor can react to a session that the
 * server has invalidated (expired/invalid token) without every call site
 * needing to know about auth state.
 */
let onSessionExpired: (() => void) | null = null;
export function registerSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const normalized = normalizeError(error);

    if (normalized.status === 401) {
      onSessionExpired?.();
    }

    return Promise.reject(normalized);
  }
);

function normalizeError(error: AxiosError<ApiErrorBody>): NormalizedApiError {
  if (!error.response) {
    // No response at all: request timed out, DNS failed, CORS blocked, or
    // the server is simply down/unreachable.
    const isTimeout = error.code === "ECONNABORTED";
    return {
      code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      message: isTimeout
        ? "The request took too long. Please try again."
        : "We couldn't reach the server. Check your connection and try again.",
      status: null,
      isNetworkError: true,
    };
  }

  const body = error.response.data;
  const code = body?.error?.code ?? "UNKNOWN_ERROR";

  return {
    code,
    message: body?.error?.message ?? messageForErrorCode(code),
    status: error.response.status,
    isNetworkError: false,
  };
}
