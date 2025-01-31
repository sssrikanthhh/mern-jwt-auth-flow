import { ErrorRequestHandler, Response } from 'express';
import z from 'zod';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpCodes';
import { AppError } from '../utils/AppError';

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

const handleAppError = (res: Response, err: AppError) => {
  return res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`Path: ${req.path}, `, err);
  if (err instanceof z.ZodError) {
    handleZodError(res, err);
    return;
  }
  if (err instanceof AppError) {
    handleAppError(res, err);
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  return;
};
