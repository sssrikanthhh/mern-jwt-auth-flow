import { CookieOptions, Response } from 'express';
import { NODE_ENV } from '../constants/env';
import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date';

export const REFRESH_PATH = '/api/auth/refresh';

const cookieDefaults: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV !== 'development'
};

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...cookieDefaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH
});

export const getAccessTokenCookieOptions = (): CookieOptions => ({
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

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken', { path: REFRESH_PATH });
