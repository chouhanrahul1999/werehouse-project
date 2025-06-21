import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

  import OrderModel from './models/order';

// Auto-retry every 30 seconds
const AUTO_RETRY_INTERVAL = 30 * 1000;

const autoRetryFailedOrders = async () => {
  try {
    const failedOrders = await OrderModel.find({ status: 'failed' });

    for (const order of failedOrders) {
      const isSuccess = Math.random() > 0.3;
      order.status = isSuccess ? 'success' : 'failed';
      order.lastSyncTime = new Date();
      order.errorMessage = isSuccess ? '' : 'Auto-retry failed';

      await order.save();
      console.log(
        `[Auto-Retry] Order ${order.orderId}: ${order.status.toUpperCase()}`
      );
    }

    if (failedOrders.length) {
      console.log(`[Auto-Retry] Retried ${failedOrders.length} failed orders.`);
    }
  } catch (err) {
    console.error('[Auto-Retry] Error during retry:', err);
  }
};

setInterval(autoRetryFailedOrders, AUTO_RETRY_INTERVAL);
