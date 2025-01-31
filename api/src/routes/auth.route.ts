import express from 'express';
import { registerHandler } from '../controllers/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', registerHandler);

export default authRoutes;
