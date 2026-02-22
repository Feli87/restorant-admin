import api from './api';
import type { Table } from '../types/table';

export const tablesService = {
  getAll: async (): Promise<Table[]> => {
    const { data } = await api.get<Table[]>('/tables');
    return data;
  },

  getById: async (id: string): Promise<Table> => {
    const { data } = await api.get<Table>(`/tables/${id}`);
    return data;
  },

  create: async (table: Partial<Table>): Promise<Table> => {
    const { data } = await api.post<Table>('/tables', table);
    return data;
  },

  update: async (id: string, table: Partial<Table>): Promise<Table> => {
    const { data } = await api.put<Table>(`/tables/${id}`, table);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },
};
