import express from 'express';
import {
  deleteSessionHandler,
  getSessionsHandler
} from '../controllers/session.controller';

const sessionRoutes = express.Router();

//prefix: /api/sessions
//get sessions of a user
sessionRoutes.get('/', getSessionsHandler);
//delete session
sessionRoutes.delete('/:id', deleteSessionHandler);
export default sessionRoutes;
