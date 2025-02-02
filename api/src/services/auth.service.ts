import sessionModel from '../models/session.model';
import userModel from '../models/user.model';
import verificationCodeModel from '../models/verificationCode.model';
import {
  NOW,
  ONE_DAY_MS,
  oneYearFromNow,
  thirtyDaysFromNow
} from '../utils/date';
import { VerificationCodeType } from '../utils/verificationCodeType';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import { appAssert } from '../utils/appAssert';
import { CONFLICT, UNAUTHORIZED } from '../constants/httpCodes';

import {
  AccessTokenPayload,
  accessTokenSignOptions,
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken
} from '../utils/jwt';

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  //check for existing user
  const existingUser = await userModel.exists({ email: data.email });
  // if the user already exists, throw an error
  appAssert(!existingUser, CONFLICT, 'This email is already taken');

  //create a new user
  const user = await userModel.create({
    email: data.email,
    password: data.password
  });

  //create a verification code
  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow()
  });

  //create a user session
  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  });

  const userId = user._id;
  const sessionId = session._id;

  //create refresh and access tokens
  const refreshToken = signToken({ sessionId }, refreshTokenSignOptions);
  const accessToken = signToken({ sessionId, userId }, accessTokenSignOptions);
  return {
    user: user.omitPassword(),
    refreshToken,
    accessToken
  };
};

export type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async (data: LoginUserParams) => {
  //find the user with the email to check if the user exists or not
  const user = await userModel.findOne({ email: data.email });
  //throw an error if the error doesn't exist
  appAssert(user, UNAUTHORIZED, 'Invalid email or password');

  //validate the password
  const isValid = await user.comparePassword(data.password);
  //throw an error, if the password is invalid
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

  //create a user session
  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  });

  const userId = user._id;
  const sessionId = session._id;

  //create refresh and access tokens
  const refreshToken = signToken({ sessionId }, refreshTokenSignOptions);
  const accessToken = signToken({ sessionId, userId }, accessTokenSignOptions);
  return {
    user: user.omitPassword(),
    refreshToken,
    accessToken
  };
};

export const logoutUser = async (accessToken: string) => {
  //verify the access token and get the payload
  const { payload } = verifyToken<AccessTokenPayload>(accessToken);
  //if the payload exists, delete the session
  if (payload) {
    await sessionModel.findByIdAndDelete(payload.sessionId);
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  //verify the refresh token
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: JWT_REFRESH_SECRET
  });
  //if the payload doesn't exist, throw an error
  appAssert(payload, UNAUTHORIZED, 'Invalid refresh token');

  //check for session
  const session = await sessionModel.findById(payload.sessionId);
  //if the session doesn't exist and the session expiresAt time is less than the current time, throw an error
  appAssert(
    session && session.expiresAt.getTime() > NOW,
    UNAUTHORIZED,
    'Session expired'
  );

  //if the session is expiring in less than a day, refresh the session
  const doesSessionNeedsRefresh =
    session.expiresAt.getTime() - NOW < ONE_DAY_MS;
  if (doesSessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  //sign new access token
  const newAccessToken = signToken(
    { sessionId: session._id, userId: session.userId },
    accessTokenSignOptions
  );
  //as we are refreshing the session, sign a new refresh token
  const newRefreshToken = doesSessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  return {
    accessToken: newAccessToken,
    newRefreshToken
  };
};
