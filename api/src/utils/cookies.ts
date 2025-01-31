import { CookieOptions, Response } from 'express';
import { NODE_ENV } from '../constants/env';
import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date';

const cookieDefaults: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV !== 'development'
};

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...cookieDefaults,
  expires: thirtyDaysFromNow(),
  path: '/api/auth/refresh'
});

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...cookieDefaults,
  expires: fifteenMinutesFromNow()
});

type setAuthCookiesParams = {
  res: Response;
  refreshToken: string;
  accessToken: string;
};

export const setAuthCookies = ({
  res,
  refreshToken,
  accessToken
}: setAuthCookiesParams) =>
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
