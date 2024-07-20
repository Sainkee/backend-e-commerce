import User from "../model/user.model.js";
import customError from "../utils/error.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error while generating tokens:", error);
    throw new customError("error while generating tokens", 500);
  }
};

export const registerUser = async (req, res, next) => {
  const { email, fullName, username, password } = req.body;

  if (
    [email, fullName, username, password].some((field) => field?.trim() === "")
  ) {
    throw new customError("all field is required", 400);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new customError("User already exists", 409);
    }

    const newUser = new User({
      email,
      fullName,
      username,
      password,
    });

    await User.create(newUser);
    const createdUser = await User.findOne({ _id: newUser._id }).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json({ createdUser, message: "user register successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  // console.log("____",req.body)
  const { email, password, username } = req.body;

  if (!(email || username)) {
    throw new customError("email or username is required", 400);
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      throw new customError("user not fouund", 404);
    }

    if (!user.isPasswordCorrect(password)) {
      throw new customError("Invalid email or password", 404);
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const cookieOption = {
      secure: false,
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOption)
      .cookie("refreshToken", refreshToken, cookieOption)
      .json({
        user: loggedInUser,
        message: "user login successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  const id = req.user._id;
  console.log("_", req.user._id);
  try {
    await User.findByIdAndUpdate(
      id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
    const cookieOption = {
      secure: false,
      httpOnly: true,
    };

    return res
      .status(200)
      .clearCookie("accessTocken", cookieOption)
      .clearCookie("refreshToken", cookieOption)
      .json({ message: "user logged out" });
  } catch (error) {
    next(new customError("something went wrong" || error.message, 500));
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new customError("unauthorized access, send refreshToken", 401);
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    );

    const user = await User.findById(decodedToken._id).select("refreshToken");

    if (!user) {
      throw new customError("invalid refresh token", 401);
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new customError(
        "refresh token expire or used try to login again",
        401
      );
    }

    const cookieOption = {
      secure: false,
      httpOnly: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefreshToken(user._id);

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOption)
      .cookie("refreshToken", newRefreshToken, cookieOption)
      .json({
        message: "access token refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    next(
      new customError(
        error.message || "Error while refreshing access token",
        500
      )
    );
  }
};
