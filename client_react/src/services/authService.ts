import apiClient from './apiClient';
import type { LoginRequest, LoginResponse, UserResponse, User } from '../types/user.model';

class AuthService {
  private readonly API_URL = '/api/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.API_URL}/login`, credentials);
    if (response.data.isSuccess && response.data.data) {
      this.setToken(response.data.data.token);
      this.setCurrentUser(response.data.data.user);
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'superadmin';
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'superadmin';
  }

  async fetchCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`${this.API_URL}/me`);
    if (response.data.isSuccess && response.data.data) {
      this.setCurrentUser(response.data.data);
    }
    return response.data;
  }
}

export default new AuthService();
