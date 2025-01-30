import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/httpCodes';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`Path: ${req.path}, `, err);
  res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  return;
};
