export type OrderStatus = 'pending' | 'success' | 'failed';

export interface Order {
  _id: string;
  orderId: string;
  channel: string;
  status: OrderStatus;
  lastSyncTime: string;
  errorMessage?: string;
}