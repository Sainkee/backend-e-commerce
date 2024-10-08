import User from "../model/user.model.js";
import customError from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById({ _id: userId });

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
  const { email, fullName, username, password, role } = req.body;

  if (
    [email, fullName, username, password, role].some(
      (field) => field?.trim() === ""
    )
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
      role,
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
      .clearCookie("accessToken", cookieOption)
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

export const initiatePasswordReset = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new customError("Email is required", 400));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new customError("User not found", 404));
    }

    const resetToken = user.generateResetPasswordToken();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password?token=${resetToken}`;

    await user.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please use the following token to reset your password: ${new URL(
        resetUrl
      )} . The token is valid for ${process.env.RESET_EXPIRY}.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Password reset token sent to email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const resetToken = req.query.token;

  if (!resetToken || !newPassword) {
    return next(
      new customError("Reset token and new password are required", 400)
    );
  }

  try {
    const decodedToken = jwt.verify(resetToken, process.env.RESET_TOKEN_KEY);
    const user = await User.findOne({
      _id: decodedToken._id,
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new customError("Invalid or expired reset token", 400));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
