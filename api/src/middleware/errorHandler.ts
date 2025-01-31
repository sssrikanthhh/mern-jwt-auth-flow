import { ErrorRequestHandler, Response } from 'express';
import z from 'zod';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpCodes';

const handleZodError = (res: Response, err: z.ZodError) => {
  const errors = err.issues.map(issue => ({
    path: issue.path.join(''),
    message: issue.message
  }));
  return res.status(BAD_REQUEST).json({
    message: err.message,
    errors
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`Path: ${req.path}, `, err);
  if (err instanceof z.ZodError) {
    handleZodError(res, err);
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  return;
};
