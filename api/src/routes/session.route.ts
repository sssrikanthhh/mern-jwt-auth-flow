import express from 'express';
import { getSessionsHandler } from '../controllers/session.controller';

const sessionRoutes = express.Router();

//prefix: /api/sessions
//get sessions of a user
sessionRoutes.get('/', getSessionsHandler);
export default sessionRoutes;
