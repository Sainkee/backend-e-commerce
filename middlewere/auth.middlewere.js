import jwt from "jsonwebtoken";
import customError from "../utils/error.js";
import User from "../model/user.model.js";

export const JWTauthentication = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new customError("unathorized request", 401);
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new customError("Invalid Access Token", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
