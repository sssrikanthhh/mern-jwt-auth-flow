import { ErrorRequestHandler, Response } from 'express';
import z from 'zod';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpCodes';
import { AppError } from '../utils/AppError';
import { clearAuthCookies, REFRESH_PATH } from '../utils/cookies';

const handleZodError = (res: Response, err: z.ZodError) => {
  const errors = err.issues.map(issue => ({
    path: issue.path.join(''),
    message: issue.message
  }));
  return res.status(BAD_REQUEST).json({
    message: 'validation failed',
    errors
  });
};

const handleAppError = (res: Response, err: AppError) => {
  return res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode
  });
};

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  console.log(`Path: ${req.path}, `, err);

  //if an error occurs in the refresh path like refresh token missing, payload is undefined or the session is missing or expired -  clear all cookies
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  //handling json schema errors if the error is a syntax error, throw an error
  if (err instanceof SyntaxError) {
    res.status(BAD_REQUEST).json({
      message: 'Invalid request body'
    });
    return;
  }

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
