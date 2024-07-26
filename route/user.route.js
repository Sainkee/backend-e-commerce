import express from "express";
import {
  initiatePasswordReset,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
} from "../controller/user.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access").post(refreshAccessToken);
router.route("/logout").post(JWTauthentication, logoutUser);
router.post("/password-reset", initiatePasswordReset);
router.post("/reset-password", resetPassword);

export default router;
