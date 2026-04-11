import { Response } from 'express';
import { env, isProduction, isStaging } from '../config/env';

const isSecure = isProduction || isStaging;

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? ('none' as const) : ('lax' as const),
  path: '/',
};

export const setAccessTokenCookie = (res: Response, token: string): void => {
  res.cookie('accessToken', token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: parseToMilliseconds(env.JWT_ACCESS_EXPIRES_IN),
  });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: parseToMilliseconds(env.JWT_REFRESH_EXPIRES_IN),
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

const parseToMilliseconds = (duration: string): number => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);

  const ms: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  return value * (ms[unit] ?? ms['m']);
};
