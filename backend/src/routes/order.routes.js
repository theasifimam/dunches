import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  verifyPayment,
} from '../controllers/order.controller.js';
import { protect, protectStrict, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Strict auth — order creation and payment verification require a real logged-in user
router.post('/', protectStrict, createOrder);
router.post('/verify-payment', protectStrict, verifyPayment);

// Standard auth for reading user orders
router.use(protect);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.get('/', adminOnly, getAllOrders);

export default router;
