import express from "express";
import { UserModel } from "../db/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/generateTokens";
import { JWT_SECRET } from "../../config";
import { accessTokenType } from "types/accessTokenType";
import { searchUsersByText } from "../helpers/searchUsersByText";
import { UserType } from "../types/chatTypes";
import fs from "fs";
import { get } from "lodash";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName } = req.body as Record<
      string,
      string
    >;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Enter all values!",
      });
    }

    const existUser = await UserModel.findOne({ email: email });
    if (existUser)
      return res
        .status(409)
        .json({ success: false, message: "User with this email exists!" });

    const newUser = new UserModel({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });
    await newUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Account has been registerd" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body as Record<string, string>;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot sign in!" });
    }

    const existUser = await UserModel.findOne({ email: email });

    if (!existUser) {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect!" });
    }

    const checkPassword = await bcrypt.compare(password, existUser.password);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Email or password is incorrect!" });
    }
    const accessToken = generateAccessToken({
      id: existUser.id,
      firstName: existUser.firstName,
      lastName: existUser.lastName,
    });
    const refreshToken = generateRefreshToken({
      id: existUser.id,
      firstName: existUser.firstName,
      lastName: existUser.lastName,
    });

    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 1 * 1 * 15 * 60 * 1000),
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      data: {
        _id: existUser._id,
        email,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        refreshToken,
        accessToken,
        urlProfileImage: existUser.urlProfileImage,
      },
      message: "You have been logged in",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAccessToken = (
  req: express.Request,
  res: express.Response
) => {
  const refreshToken: string = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token does not exist" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as accessTokenType;
    const accessToken = generateAccessToken({
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    });

    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 1 * 1 * 15 * 60 * 1000),
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      accessToken: accessToken,
      success: true,
      message: "Access token has been updated",
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: `Error: ${error.message ?? error}` });
  }
};

export const logout = (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("auth");
    return res
      .status(200)
      .json({ success: true, message: "Signed out successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: `Error: ${err?.message ?? err}` });
  }
};

export const findUserById = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getUsersByText = async (
  req: express.Request,
  res: express.Response
) => {
  const { text } = req.params;
  try {
    let users = (await UserModel.find()) as UserType[];
    const me = get(req, "identity") as UserType;
    if (text) {
      users = searchUsersByText(text, users);
    }
    return res
      .status(200)
      .json(users.filter((x) => x._id.toString() !== me._id.toString()));
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateUserImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Pick picture!",
      });
    }
    const { _id, imageName } = req.body;
    const { file } = req;

    const user = await UserModel.findByIdAndUpdate(
      _id,
      { urlProfileImage: file.filename },
      { new: true }
    );
    if (imageName !== "avatar.png") {
      fs.unlink(`../frontend/public/uploads/${imageName}`, (err) => {
        if (err) return res.status(500).json(err);
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteUserImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    const prevImageName = user.urlProfileImage;
    if (user.urlProfileImage === "avatar.png") {
      return res.status(400).json({
        success: false,
        message: "You do not set any image !",
      });
    }

    user.urlProfileImage = "avatar.png";
    await user.save();
    if (prevImageName !== "avatar.png") {
      fs.unlink(`../frontend/public/uploads/${prevImageName}`, (err) => {
        if (err) return res.status(500).json(err);
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const editPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (confirmPassword !== newPassword)
      return res.status(400).json("Passwords not match");
    if (currentPassword === newPassword)
      return res
        .status(400)
        .json("Current password is the same what new password");
    const user = get(req, "identity") as UserType;
    if (!user) return res.status(400).json("User is not exist");
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: newPassword,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const editEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    const user = get(req, "identity") as UserType;
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { email },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};
