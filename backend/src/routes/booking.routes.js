import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Local optional auth middleware to associate logged-in users to bookings
const optionalProtect = (req, res, next) => {
  let token;
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.id, role: decoded.role };
      }
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

router.post('/', optionalProtect, createBooking);
router.patch('/:id/cancel', optionalProtect, cancelBooking);

// Protected routes
router.get('/my', protect, getMyBookings);

// Admin-only routes
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
