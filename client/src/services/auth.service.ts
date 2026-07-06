import { apiClient } from "@/services/api-client";
import type {
  ApiSuccess,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<ApiSuccess<{ user: User }>>("/auth/register", payload);
    return data.data.user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const { data } = await apiClient.post<ApiSuccess<{ user: User }>>("/auth/login", payload);
    return data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccess<{ user: User }>>("/auth/me");
    return data.data.user;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.patch<ApiSuccess<{ user: User }>>("/users/me", payload);
    return data.data.user;
  },
};
