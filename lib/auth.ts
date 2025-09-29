import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface JWTPayload {
  userId: string;
  mobile: string;
  propertyId: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
