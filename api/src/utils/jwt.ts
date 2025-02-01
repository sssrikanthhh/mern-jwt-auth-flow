import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { SessionDocument } from '../models/session.model';
import { UserDocument } from '../models/user.model';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';

export type AccessTokenPayload = {
  sessionId: SessionDocument['_id'];
  userId: UserDocument['_id'];
};

export type RefreshTokenPayload = {
  sessionId: SessionDocument['_id'];
};

export type SignOptionsAndSecret = SignOptions & { secret: string };

const defaultsSignOptions: SignOptions = {
  audience: ['user']
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '15m',
  secret: JWT_SECRET
};
export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '30d',
  secret: JWT_REFRESH_SECRET
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  //extract secret from options and use the rest as sign options
  //if the options are not passed, use accessTokenSignOptions
  const { secret, ...restOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    //if the options are passed, will override the defaults(audience)
    ...defaultsSignOptions,
    ...restOptions
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...restOptions } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaultsSignOptions,
      ...restOptions
    }) as TPayload;
    console.log(payload);
    return {
      payload
    };
  } catch (err: any) {
    return {
      error: err.message
    };
  }
};
