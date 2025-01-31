import assert from 'node:assert';
import { HttpStatusCode } from '../constants/httpCodes';
import { AppErrorCode } from '../constants/appErrorCode';
import { AppError } from './AppError';

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));
