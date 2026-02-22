import api from './api';
import type { User, UserRole } from '../types/user';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (user: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<User>('/users', user);
    return data;
  },

  update: async (id: string, user: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, user);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
