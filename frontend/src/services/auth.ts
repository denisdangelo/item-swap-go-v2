import { apiService } from './api/ApiService';
import type { User, LoginCredentials, RegisterData } from '@/types';

// Mock data para demonstração
const MOCK_USER: User = {
  id: 'demo-user-123',
  name: 'Usuário Demo',
  email: 'demo@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  rating: 4.5,
  location: {
    latitude: -23.55052,
    longitude: -46.633308,
    address: 'São Paulo, SP',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock_jwt_token_' + Date.now();

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/login',
      credentials
    );
    localStorage.setItem('token', token);
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/register',
      data
    );
    localStorage.setItem('token', token);
    return user;
  },

  async loginWithGoogle(accessToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Google - Token:', accessToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/google', { accessToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Google',
      email: 'google@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async loginWithFacebook(accessToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Facebook - Token:', accessToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/facebook', { accessToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Facebook',
      email: 'facebook@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=facebook',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async loginWithApple(identityToken: string): Promise<User> {
    // Simular resposta da API
    console.log('Login com Apple - Token:', identityToken);

    // Em produção, isso seria uma chamada real para a API
    // const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/apple', { identityToken });

    // Mock para demonstração
    const mockUser: User = {
      ...MOCK_USER,
      name: 'Usuário Apple',
      email: 'apple@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apple',
    };

    localStorage.setItem('token', MOCK_TOKEN);
    return mockUser;
  },

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.patch<User>('/auth/profile', data);
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.patch('/auth/password', { currentPassword, newPassword });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/reset-password/confirm', { token, newPassword });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  },

  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  },
};
