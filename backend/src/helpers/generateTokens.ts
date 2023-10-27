import jwt from "jsonwebtoken";
import { accessTokenType } from "types/accessTokenType";
import { JWT_SECRET } from "../../config";

export const refreshTokens: string[] = [];

export function generateAccessToken(user: accessTokenType) {
  return jwt.sign(user, JWT_SECRET);
}

export function generateRefreshToken(user: accessTokenType) {
  const refreshToken = jwt.sign(user, JWT_SECRET);
  refreshTokens.push(refreshToken);
  return refreshToken;
}
