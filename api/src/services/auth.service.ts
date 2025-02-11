import sessionModel from '../models/session.model';
import userModel from '../models/user.model';
import verificationCodeModel from '../models/verificationCode.model';
import {
  fiveMinAgo,
  NOW,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow
} from '../utils/date';
import { VerificationCodeType } from '../utils/verificationCodeType';
import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import { appAssert } from '../utils/appAssert';
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED
} from '../constants/httpCodes';

import {
  AccessTokenPayload,
  accessTokenSignOptions,
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken
} from '../utils/jwt';
import VerificationCodeModel from '../models/verificationCode.model';
import UserModel from '../models/user.model';
import { sendEmail } from '../utils/sendEmail';
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate
} from '../utils/emailTempletes';
import { hashValue } from '../utils/bcrypt';

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

  //send email
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  const { error } = await sendEmail({
    to: data.email,
    ...getVerifyEmailTemplate(url)
  });

  if (error) {
    console.log();
  }
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

//verify email
export const verifyEmail = async (code: string) => {
  //find the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: Date.now() }
  });
  //if not found, throw an error
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');
  //find the user and update as verified
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode?.userId,
    {
      verified: true
    },
    { new: true }
  );
  //if the user not able to verified, throw an error
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');
  //delete the verification code
  await validCode.deleteOne();
  return {
    user: updatedUser.omitPassword()
  };
};

//forgot password
export const sendPasswordResetEmail = async (email: string) => {
  //find the user with the email
  const user = await UserModel.findOne({ email });
  //if the user doesn't exist, throw an error
  appAssert(user, NOT_FOUND, 'User not found');
  //rate limiting emails(2 emails per 5 minutes), to avoid the user from spamming
  const fiveMinAge = fiveMinAgo();
  const recentEmails = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAge }
  });
  //if the user has sent 2 emails in the last 5 minutes, throw an error
  appAssert(
    recentEmails <= 1,
    TOO_MANY_REQUESTS,
    'Too many request, please try again later'
  );
  //create a password reset verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt
  });

  //send verification email
  const url = `${APP_ORIGIN}/password/reset/${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;
  const { data, error } = await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url)
  });
  //if the email fails to send, throw an error
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );
  return {
    url,
    emailId: data.id
  };
};

//reset password
type ResetPasswordParams = {
  verificationCode: string;
  password: string;
};
export const resetPassword = async ({
  password,
  verificationCode
}: ResetPasswordParams) => {
  //check the verification code is valid
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: NOW }
  });
  //if the code is not valid throw an error
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');
  //update the user password
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      password: await hashValue(password)
    },
    {
      new: true
    }
  );
  //if anything goes wrong throw an error
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to update password');
  //delete the verification code
  await validCode.deleteOne();
  //once the password is updated, delete all the user session(logout of all devices)
  await sessionModel.deleteMany({
    userId: updatedUser._id
  });

  return {
    user: updatedUser.omitPassword()
  };
};
