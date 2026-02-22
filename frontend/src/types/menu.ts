export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
