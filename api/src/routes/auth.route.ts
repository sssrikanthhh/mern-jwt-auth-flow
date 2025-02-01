import express from 'express';
import {
  loginHandler,
  logoutHandler,
  registerHandler
} from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/logout', logoutHandler);

export default authRoutes;
