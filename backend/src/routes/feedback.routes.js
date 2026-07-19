import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getAnalytics,
} from '../controllers/feedback.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Publicly accessible for the QR Flow (and admin use)
router.post('/', createFeedback);

// Admin only routes
router.get('/', protect, adminOnly, getFeedbacks);
router.get('/analytics', protect, adminOnly, getAnalytics);

export default router;
