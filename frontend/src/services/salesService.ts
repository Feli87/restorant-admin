import api from './api';

export interface Sale {
  id: string;
  order_id: string;
  subtotal: number;
  tax: number;
  total: number;
  payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_PAYMENT' | 'OTHER';
  cashier_id?: string;
  tip: number;
  created_at: string;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  paymentBreakdown: Record<string, number>;
}

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const { data } = await api.get<Sale[]>('/sales');
    return data;
  },

  getDailySummary: async (date?: string): Promise<DailySummary> => {
    const params = date ? { date } : {};
    const { data } = await api.get<DailySummary>('/sales/daily-summary', { params });
    return data;
  },

  getById: async (id: string): Promise<Sale> => {
    const { data } = await api.get<Sale>(`/sales/${id}`);
    return data;
  },

  create: async (sale: Partial<Sale>): Promise<Sale> => {
    const { data } = await api.post<Sale>('/sales', sale);
    return data;
  },
};
