export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  qrCode?: string;
  zone?: string;
  createdAt: string;
  updatedAt: string;
}
