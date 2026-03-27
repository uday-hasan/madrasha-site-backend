import { Response } from "express";
import { env, isProduction } from "../config/env";

// ================================
// COOKIE UTILITIES
// Sets HttpOnly cookies for access and refresh tokens.
//
// HttpOnly = JavaScript cannot read these cookies.
// This protects against XSS attacks — even if an attacker
// injects JavaScript, they can't steal the tokens.
//
// Secure = Only sent over HTTPS (enabled in production).
// SameSite = Controls when cookies are sent with cross-site requests.
// ================================

const COOKIE_OPTIONS = {
  httpOnly: true, // Not accessible via JavaScript
  secure: isProduction, // HTTPS only in production
  sameSite: "lax" as const, // Protect against CSRF
  path: "/",
};

// Set the access token cookie (short-lived)
export const setAccessTokenCookie = (res: Response, token: string): void => {
  res.cookie("accessToken", token, {
    ...COOKIE_OPTIONS,
    maxAge: parseToMilliseconds(env.JWT_ACCESS_EXPIRES_IN), // e.g. 15 minutes
  });
};

// Set the refresh token cookie (long-lived)
export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    ...COOKIE_OPTIONS,
    maxAge: parseToMilliseconds(env.JWT_REFRESH_EXPIRES_IN), // e.g. 7 days
    path: "/api/v1/auth", // Refresh token only sent to /auth routes
  });
};

// Clear both auth cookies (used on logout)
export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
};

// Convert duration string to milliseconds
// "15m" → 900000, "7d" → 604800000
const parseToMilliseconds = (duration: string): number => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);

  const ms: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  return value * (ms[unit] ?? ms["m"]);
};
