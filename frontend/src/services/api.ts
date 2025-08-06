import type { ApiError, PaginatedResponse } from '@/types';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import type { ChangePasswordData, LoginData, RegisterData, UserProfile } from './types';

// Verificação do ambiente
const isClient = () => {
  return typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined';
};

// Chave de criptografia (em produção, deve vir de variável de ambiente)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-dev-key-change-in-prod';

// Função utilitária para gerenciar o armazenamento seguro
const secureStorage = {
  get: (key: string): string | null => {
    try {
      if (!isClient()) return null;
      const encrypted = globalThis.window.localStorage.getItem(key);
      if (!encrypted) return null;
      const decrypted = AES.decrypt(encrypted, ENCRYPTION_KEY).toString(enc.Utf8);
      const data = JSON.parse(decrypted);
      // Verifica expiração
      if (data.expiresAt && data.expiresAt < Date.now()) {
        secureStorage.remove(key);
        return null;
      }
      return data.value;
    } catch {
      return null;
    }
  },
  set: (key: string, value: string, expiresInMs?: number): void => {
    try {
      if (!isClient()) return;
      const data = {
        value,
        expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
      };
      const encrypted = AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
      globalThis.window.localStorage.setItem(key, encrypted);
    } catch {
      // Ignora erros de armazenamento
    }
  },
  remove: (key: string): void => {
    try {
      if (isClient()) {
        globalThis.window.localStorage.removeItem(key);
      }
    } catch {
      // Ignora erros de armazenamento
    }
  },
};

const api = axios.create({
  baseURL: '/api', // Usando o proxy do Vite
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
  maxRedirects: 5,
  timeout: 30000, // 30 segundos
  withCredentials: true, // Importante para cookies HttpOnly
});

// Interceptor para adicionar o token de autenticação e otimizar cabeçalhos
api.interceptors.request.use((config) => {
  // Limpar cabeçalhos desnecessários
  delete config.headers['X-Requested-With'];
  delete config.headers['X-XSRF-TOKEN'];

  // Adicionar token se existir (agora usando secureStorage)
  const token = secureStorage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para tratar erros e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Erro na requisição',
      code: error.response?.data?.code,
      status: error.response?.status,
    };

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = secureStorage.get('refreshToken');

      if (refreshToken) {
        try {
          // Tenta obter um novo token
          const { data } = await api.post('/auth/refresh', { refreshToken });
          const { token, expiresIn } = data;

          // Armazena o novo token
          secureStorage.set('token', token, expiresIn * 1000);

          // Atualiza o cabeçalho e repete a requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Se falhar o refresh, limpa os tokens e redireciona para login
          secureStorage.remove('token');
          secureStorage.remove('refreshToken');
          if (isClient()) {
            globalThis.window.location.href = '/login';
          }
        }
      } else {
        // Se não houver refresh token, limpa o token e redireciona
        secureStorage.remove('token');
        if (isClient()) {
          globalThis.window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 431) {
      // Limpar dados de autenticação em caso de erro de cabeçalho
      secureStorage.remove('token');
      secureStorage.remove('refreshToken');
      apiError.message = 'Erro de cabeçalho: dados de autenticação inválidos';
    }

    return Promise.reject(apiError);
  }
);

export const apiService = {
  get: async <T>(url: string, params?: Record<string, any>) => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  getPaginated: async <T>(url: string, params?: Record<string, any>) => {
    const response = await api.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: any) => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data?: any) => {
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string, config?: any) => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

export { api, secureStorage };

export { itemsService } from './items';

// Re-exportar tipos
export type {
  CategoryWithItemCount,
  ChangePasswordData,
  CreateItemData,
  ItemSearchFilters,
  LoginData,
  RegisterData,
  UpdateItemData,
  UserProfile,
} from './types';

// Re-exportar tipos do arquivo principal
export type { Category, ItemWithDetails } from '@/types';

// Serviços da API
export const authApiService = {
  login: async (data: LoginData) => {
    return apiService.post('/auth/login', data);
  },
  register: async (data: RegisterData) => {
    return apiService.post('/auth/register', data);
  },
  logout: async () => {
    return apiService.post('/auth/logout');
  },
  refreshToken: async (refreshToken: string) => {
    return apiService.post('/auth/refresh', { refreshToken });
  },
  changePassword: async (data: ChangePasswordData) => {
    return apiService.post('/auth/change-password', data);
  },
  updateProfile: async (data: UserProfile) => {
    return apiService.put('/auth/profile', data);
  },
};

import { itemsService } from './items';
export { itemsService as itemsApiService };

export const categoriesApiService = {
  getActiveCategories: async () => {
    return apiService.get('/categories');
  },
  clearCache: () => {
    // Implementar cache se necessário
  },
};
