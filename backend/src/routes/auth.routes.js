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
  phoneCheck,
  phoneLoginPassword,
  phoneForgotPassword,
  phoneResetPassword,
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

// Phone auth
router.post('/phone-check', phoneCheck);               // Check if mobile is registered
router.post('/phone-login-password', phoneLoginPassword); // Login: existing user → password
router.post('/phone-login-request', phoneLoginRequest);   // Signup: new user → send OTP
router.post('/phone-login-verify', phoneLoginVerify);     // Signup: verify OTP + create account
router.post('/phone-forgot-password', phoneForgotPassword);
router.post('/phone-reset-password', phoneResetPassword);

export default router;
