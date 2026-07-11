import api from './api';
import type { Order } from '@/types';

export const orderService = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<{ data: Order[]; total: number }>('/orders', { params }),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  create: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Order>('/orders', data),

  update: (id: string, data: Partial<Order>) =>
    api.patch<Order>(`/orders/${id}`, data),

  cancel: (id: string) =>
    api.post(`/orders/${id}/cancel`),

  trackOrder: (id: string) =>
    api.get(`/orders/${id}/track`),
};
