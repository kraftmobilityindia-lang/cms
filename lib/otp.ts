import crypto from "crypto";

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function getOTPExpiry(): Date {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
}

export function isOTPExpired(expiryTime: Date): boolean {
  return new Date() > expiryTime;
}

