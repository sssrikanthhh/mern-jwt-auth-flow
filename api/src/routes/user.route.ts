import express from 'express';
import { getUserHandler } from '../controllers/user.controller';

const userRoutes = express.Router();

//prefix: /api/user
//get user
userRoutes.get('/', getUserHandler);

export default userRoutes;
