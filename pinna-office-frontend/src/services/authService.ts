import api from './api';
import type { User, Address } from '@/types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),

  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),

  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  getCurrentUser: () =>
    api.get<User>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/auth/profile', data),

  updatePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/password', { oldPassword, newPassword }),

  updateAddress: (address: Address) =>
    api.post<Address>('/auth/address', address),

  requestPasswordReset: (email: string) =>
    api.post('/auth/password-reset', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/password-reset/confirm', { token, password }),
};
