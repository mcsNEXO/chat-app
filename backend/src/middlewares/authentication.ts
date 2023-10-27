import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { UserModel } from "../db/models/user";
import { accessTokenType } from "../types/accessTokenType";
import { merge } from "lodash";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res.status(403).json("Access token is missing");
  }

  const tokenData = jwt.verify(accessToken, JWT_SECRET) as accessTokenType;
  const existUser = await UserModel.findById(tokenData?.id);
  if (!existUser) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
  merge(req, { identity: existUser });

  return next();
};
