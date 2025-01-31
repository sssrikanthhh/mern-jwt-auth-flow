import jwt from 'jsonwebtoken';
import sessionModel from '../models/session.model';
import userModel from '../models/user.model';
import verificationCodeModel from '../models/verificationCode.model';
import { oneYearFromNow } from '../utils/date';
import { VerificationCodeType } from '../utils/verificationCodeType';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import { appAssert } from '../utils/appAssert';
import { CONFLICT } from '../constants/httpCodes';

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await userModel.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, 'This email is already taken');

  const user = await userModel.create({
    email: data.email,
    password: data.password
  });

  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow()
  });

  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  });

  const refreshToken = jwt.sign(
    {
      sessionId: session._id
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
      audience: ['user']
    }
  );
  const accessToken = jwt.sign(
    {
      sessionId: session._id,
      userId: user._id
    },
    JWT_SECRET,
    {
      expiresIn: '15m',
      audience: ['user']
    }
  );
  return {
    user,
    refreshToken,
    accessToken
  };
};
