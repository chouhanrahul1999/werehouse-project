import express from 'express';
import { seedOrders } from '../controllers/seedOrders';
import { getOrders } from '../controllers/getOrders';
import { syncOrders } from '../controllers/syncOrders';
import { retryOrder } from '../controllers/retryOrder';


const router = express.Router();

router.get('/', getOrders);
router.post('/sync', syncOrders);
router.post('/retry/:id', retryOrder);
router.post('/seed', seedOrders);

export default router;
