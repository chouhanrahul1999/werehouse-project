import mongoose, { Schema } from 'mongoose';
import { Order } from '../types/order';

const orderSchema = new Schema<Order>({
  orderId: { type: String, required: true },
  channel: { type: String, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
  lastSyncTime: { type: Date, required: true },
  errorMessage: { type: String }
});

export default mongoose.model<Order>('Order', orderSchema);