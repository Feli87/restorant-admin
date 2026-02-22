import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min_stock: number;
  unit_cost: number;
  created_at: string;
  updated_at: string;
}

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const { data } = await api.get<InventoryItem[]>('/inventory');
    return data;
  },

  getAlerts: async (): Promise<InventoryItem[]> => {
    const { data } = await api.get<InventoryItem[]>('/inventory/alerts');
    return data;
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const { data } = await api.get<InventoryItem>(`/inventory/${id}`);
    return data;
  },

  create: async (item: Partial<InventoryItem>): Promise<InventoryItem> => {
    const { data } = await api.post<InventoryItem>('/inventory', item);
    return data;
  },

  update: async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    const { data } = await api.put<InventoryItem>(`/inventory/${id}`, item);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },
};
