import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { emailValidator, isValidNumber } from "../utils/dataValidator.js";
import { generateOTP, hashOTP } from "../utils/otpGenerator.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../services/mailServices/email.js";
import { generateTokenAndSetCookie } from "../utils/jwt.js";
import { getMinutesFromNow } from "../utils/helper.js";
import { comparePassword, hashPassword, isPasswordSame } from "../utils/password.js";
import { sendOTPBySMS } from "../services/smsServices/smsServices.js";
import admin from "../config/firebaseAdmin.js";

/**
 * @desc    Register user using EMAIL
 * @route   POST /v1/api/auth/registerAuth/email
 * @access  Public
 */
export const registerUserByEmail = async (req, res) => {
  try {
    // Extract data from request body
    const { email, password, confirmPassword } = req.body;

    /**
     * Step 1: Validate required fields
     */
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /**
     * Step 2: Password match check
     */
    if (!emailValidator(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }


    /**
     * Step 3: Validate email format
     */
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    /**
     * Step 4: Check if user already exists
     */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Generate and hased OTP.
    const verificationCode = generateOTP();
    const hashedVerificationCode = await hashOTP(verificationCode);
    const hashedPassword = await hashPassword(password);

    // Send verification code to the email.
    const isEmailSend = await sendVerificationEmail(email, verificationCode);

    if (!isEmailSend.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to send email due to an internal error"
      })
    }

    /**
     * Step 5: Create user
     * - Password hashing handled in User model
     * - Role will be set automatically (default: user)
     */
    const user = await User.create({
      email,
      password: hashedPassword,
      verificationCode: hashedVerificationCode,
      verificationCodeExpireAt: getMinutesFromNow(10) // 10 minutes
    });

    /**  Generate JWT */
    generateTokenAndSetCookie(res, user._id, user.role);

    /**
     * Step 6: Send response (NO sensitive data)
     */

    return res.status(201).json({
      success: true,
      message: "Please verify your email.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Login user using EMAIL
 * @route   POST /v1/api/auth/loginAuth/email
 * @access  Public
 */
export const loginUserByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    /**
     * Step 1: Validate input
     */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /**
     * Step 2: Find user by email
     */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /**
     * Step 3: Check if account is blocked
     */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked, contact administrator.",
      });
    }

    /**
     * Step 4: Compare password
     */
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /**
     * Step 5: Update last login
     */
    user.lastLogin = new Date();
    await user.save();

    /**  Generate JWT */
    generateTokenAndSetCookie(res, user._id, user.role);

    /**
     * Step 6: Respond (JWT will be added later)
     */
    const { password: userPassword , ...userData } = user._doc;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Register or login by mobile number
 * @route   POST /v1/api/auth/mobileAuth/number
 * @access  Public
 */
export const mobileAuth = async (req, res) => {
  try {
    const { number } = req.body;

    // -----------------------------
    // Step 1: Validate required fields
    // -----------------------------
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!isValidNumber(number)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required",
      });
    }

    // -----------------------------
    // Step 2: Generate OTP
    // -----------------------------
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp); // ensure async if using bcrypt

    // -----------------------------
    // Step 3: Check if user exists
    // -----------------------------
    let user = await User.findOne({ mobileNumber: number });

    if (!user) {
      // Signup flow (no password yet)
      user = await User.create({
        mobileNumber: number,
        verificationCode: hashedOTP,
        verificationCodeExpireAt: getMinutesFromNow(10), // expires in 10 min
      });
    } else {
      // Existing user → update OTP
      user.verificationCode = hashedOTP;
      user.verificationCodeExpireAt = getMinutesFromNow(10);
      await user.save();
    }


    // -----------------------------
    // Step 4: Send OTP via SMS
    // -----------------------------
    const smsResult = await sendOTPBySMS(number, otp);
    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Try again.",
      });
    }

    // -----------------------------
    // Step 5: Generate JWT & Set Cookie
    // -----------------------------
    generateTokenAndSetCookie(res, user._id, user.role || "user");

    return res.status(201).json({
      success: true,
      message: "OTP sent to your mobile number. Please verify.",
      data: {
        number: user.mobileNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Mobile Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * @desc    Verify OTP for phone or email login/signup
 * @route   POST /v1/api/auth/verificationAuth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    // Get token from cookie
    const token = req.cookies.citizoneCookie;

    if (!verificationCode || !token) {
      return res.status(400).json({
        success: false,
        message: "OTP session expired",
      });
    }

    // Verify JWT using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Session expired, login again",
      });
    }

    const hashedOTP = await hashOTP(verificationCode);

    // Validate OTP + expiry
    const data = user.verificationCodeExpireAt;
    const data2 = Date.now();
    if (
      user.verificationCode !== hashedOTP ||
      user.verificationCodeExpireAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (!user.isUserVerified) {
      if (user?.email) {
        await sendWelcomeEmail(user.email);
      } else {

      }
    }

    // Clear OTP fields
    user.verificationCode = undefined;
    user.verificationCodeExpireAt = undefined;
    user.isUserVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Clear OTP cookie
    res.clearCookie("citizoneCookie");

    // Generate token again
    generateTokenAndSetCookie(res, user._id, user.role);
    const { password, ...userData } = user._doc;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Error in OTP verification controller",
    });
  }
};

/**
 * @desc    Forgot password by email.
 * @route   POST /v1/api/auth/verificationAuth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1: Validate required field
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Step 2: Validate email format
    if (!emailValidator(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Step 3: Find user by email (if exists)
    const user = await User.findOne({ email });

    // Step 4: Generate & send password reset email ONLY if user exists
    if (user) {
      const resetURL = process.env.CLIENT_URL + "cityzone/auth/forgot-password";
      generateTokenAndSetCookie(res, user._id, user.role);
      await sendPasswordResetEmail(user.email, resetURL);
    }

    // Step 5: Always return success (prevents email enumeration)
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Reset password by email.
 * @route   POST /v1/api/auth/verificationAuth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Step 1: Validate input
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword are required",
      });
    }

    if (!isPasswordSame(password, confirmPassword)) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Step 2: Get token from cookies
    const token = req.cookies.citizoneCookie;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session expired, try again",
      });
    }

    // Step 3: Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session, try again",
      });
    }

    // Step 4: Find user
    const user = await User.findById(decoded.userId);
    const hashedPassword = await hashPassword(password);
    const isSamePassword = await comparePassword(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Password should not be last password"
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, try again",
      });
    }

    // Step 5: Hash new password & save
    user.password = hashedPassword;
    user.lastLogin = new Date();
    await user.save();

    // Step 6: reset cookie
    res.clearCookie("citizoneCookie");

    // Step 7: Issue new login JWT
    generateTokenAndSetCookie(res, user._id, user.role);
    sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: {
        userId: user._id,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });

  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Logout current user.
 * @route   POST /v1/api/auth/verifiedAuth/logout-user
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  res.clearCookie("citizoneCookie", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/**
 * @desc    Get current user.
 * @route   POST /v1/api/auth/verificationAuth/current-user
 * @access  Public
 */
export const getCurrentUser = async (req, res) => {
  try {
    res.json({success: true, message: "fetch user data successfully", data: req.user});
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    /**
     * Verify token with Firebase
     */
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const phone = decoded.phone_number;

    /**
     * Find or create user
     */
    let user = await User.findOne({ mobileNumber: phone });

    if (!user) {
      user = await User.create({
        mobileNumber: phone,
        isPhoneVerified: true,
      });
    }

    /**
     * Generate JWT (your system)
     */
    generateTokenAndSetCookie(res, user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: {
        phone,
        userId: user._id,
      },
    });

  } catch (error) {
    console.error("Firebase Verify Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
};