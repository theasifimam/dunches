import express from 'express';
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  phoneLoginRequest,
  phoneLoginVerify,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/phone-login-request', phoneLoginRequest);
router.post('/phone-login-verify', phoneLoginVerify);

export default router;
