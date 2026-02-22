export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
  CHEF = 'CHEF',
  TABLE_USER = 'TABLE_USER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  restaurantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
