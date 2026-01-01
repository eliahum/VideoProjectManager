import type { BaseDataResponse } from './base-response.model';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  data?: {
    token: string;
    user: User;
  };
  errorText?: string;
}

export interface UserResponse extends BaseDataResponse<User> {}
