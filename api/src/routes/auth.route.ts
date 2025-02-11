import express from 'express';
import {
  sendPasswordResetHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  verifyEmailHandler
} from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
//email verification
authRoutes.get('/email/verify/:code', verifyEmailHandler);
//forgot password
authRoutes.post('/password/forgot', sendPasswordResetHandler);

export default authRoutes;
