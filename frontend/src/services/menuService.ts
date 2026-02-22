import api from './api';
import type { Category, MenuItem } from '../types/menu';

export const menuService = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/menu/categories');
    return data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const { data } = await api.get<Category>(`/menu/categories/${id}`);
    return data;
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const { data } = await api.post<Category>('/menu/categories', category);
    return data;
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const { data } = await api.put<Category>(`/menu/categories/${id}`, category);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/menu/categories/${id}`);
  },

  getItems: async (): Promise<MenuItem[]> => {
    const { data } = await api.get<MenuItem[]>('/menu/items');
    return data;
  },

  getItem: async (id: string): Promise<MenuItem> => {
    const { data } = await api.get<MenuItem>(`/menu/items/${id}`);
    return data;
  },

  createItem: async (item: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await api.post<MenuItem>('/menu/items', item);
    return data;
  },

  updateItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await api.put<MenuItem>(`/menu/items/${id}`, item);
    return data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/menu/items/${id}`);
  },
};
