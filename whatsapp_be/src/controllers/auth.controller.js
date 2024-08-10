import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    //createUser service
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    //generateToken service
    const access_token = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    //refreshing the token
    //helping user to obtain new access token without requiring to log in again
    const refresh_token = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    //setting refresh_token in a cookie
    //setting long_live token in cookie to prevent javascript access(httpOnly) , XSS attacks proof
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    });

    res.json({
      message: "Register success.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);
    //generateToken service
    const access_token = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    //refreshing the token
    const refresh_token = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    //setting refresh_token in a cookie
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    });

    res.json({
      message: "Login success.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refreshtoken" });
    res.json({
      message: "logged out !",
    });
  } catch (error) {
    next(error);
  }
};

//refresh token handling requests to refresh or renew access tokens
export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    //checking if its a valid user using already existing refresh_token from cookie
    if (!refresh_token) throw createHttpError.Unauthorized("Please Login.");

    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!check || !check.userId)
      throw createHttpError.Unauthorized("Invalid refresh token.");

    //findUser util
    const user = await findUser(check.userId);

    //generate new access token again of verified user
    const access_token = await generateToken(
      { userId: user.userId },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};
