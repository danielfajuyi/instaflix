import express from 'express';
import passport from 'passport';
import { register, login, getMe, googleCallback } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Local Auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getMe);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

export default router;
