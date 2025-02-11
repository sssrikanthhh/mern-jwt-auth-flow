import { RequestHandler } from 'express';
import { appAssert } from '../utils/appAssert';
import { UNAUTHORIZED } from '../constants/httpCodes';
import { AppErrorCode } from '../constants/appErrorCode';
import { AccessTokenPayload, verifyToken } from '../utils/jwt';
import mongoose from 'mongoose';

export const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'Access token missing!',
    AppErrorCode.AccessTokenNotFound
  );
  //verify and decode the token
  const { payload, err } = verifyToken<AccessTokenPayload>(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    //error(error.message) === 'jwt expired,
    err?.name === 'TokenExpiredError'
      ? 'Token expired'
      : 'Invalid access token',
    AppErrorCode.InvalidAccessToken
  );
  //attach userId and sessionId to request
  req.userId = payload.userId as mongoose.Types.ObjectId;
  req.sessionId = payload.sessionId as mongoose.Types.ObjectId;
  next();
};
