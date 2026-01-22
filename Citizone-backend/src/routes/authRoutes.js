import express from "express";
import { registerUserByEmail, loginUserByEmail, mobileAuth, otpVerification,  } from "../controllers/authControllers.js";


const router = express.Router();

/**
 * Email based authentication routes
 */
router.post("/registerAuth/email", registerUserByEmail);
router.post("/loginAuth/email", loginUserByEmail);

/**
 * Mobile authentication routes
 */
router.post("/mobileAuth/number", mobileAuth);

// Verify Email or mobile using one time password.
router.post("/otpAuth/verify-otp", otpVerification);

export default router;
