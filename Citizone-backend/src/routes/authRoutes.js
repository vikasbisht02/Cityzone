import express from "express";
import { registerUserByEmail, loginUserByEmail, mobileAuth, verifyOTP, forgotPassword, resetPassword, logoutUser, getCurrentUser, verifyFirebaseToken } from "../controllers/authControllers.js";
import { protectUserRoute } from "../middleware/authUserMiddleware.js";

const router = express.Router();

// Email based authentication routes
router.post("/registerAuth/email", registerUserByEmail);
router.post("/loginAuth/email", loginUserByEmail);

// Mobile number authentication routes
router.post("/mobileAuth/number", mobileAuth);

// OTP Verification for email/mobile
router.post("/verificationAuth/verify-code", verifyOTP);

// Password Management
// Forgot password
router.post("/verificationAuth/forgot-password", forgotPassword);
// Reset password
router.post("/verificationAuth/reset-password", resetPassword);

// Logout Current User
router.post("/verifiedAuth/logout-user", logoutUser);

// Get current logged-in user
router.post(
    "/verificationAuth/current-user",
    protectUserRoute, // Middleware validates JWT from cookie
    getCurrentUser    // Returns user info
);

// Get firebase access token
router.post("/firebase/verify", verifyFirebaseToken);

export default router;
