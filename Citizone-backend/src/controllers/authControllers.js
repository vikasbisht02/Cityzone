import User from "../models/UserModel.js";
import { comparePassword } from "../utils/password.js";
import { emailValidator } from "../utils/emailValidator.js";
import { generateOTP, hashOTP } from "../utils/otpGenerator.js";

/**
 * @desc    Register user using EMAIL
 * @route   POST /v1/api/auth/register/email
 * @access  Public
 */
export const registerUserByEmail = async (req, res) => {
  try {
    // Extract data from request body
    const { firstName, lastName, age, gender, email, password, confirmPassword } = req.body;

    /**
     * Step 1: Validate required fields
     */
    if (!firstName || !lastName || !age || !gender || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /**
     * Step 2: Password match check
     */
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    /**
     * Step 3: Validate email format
     */
    if (!emailValidator(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
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

    /**
     * Step 5: Create user
     * - Password hashing handled in User model
     * - Role will be set automatically (default: user)
     */
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
    });

    /**
     * Step 6: Send response (NO sensitive data)
     */

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: `${user.firstName + user.lastName}`,
        age: user.age,
        gender: user.gender,
        email: user.email,
        createdAt: user.createdAt,
      },
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
 * @route   POST /v1/api/auth/login/email
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
        message: "Account is blocked. Contact administrator.",
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

    /**
     * Step 6: Respond (JWT will be added later)
     */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * @desc    Send OTP for phone login/signup
 * @route   POST /v1/api/auth/mobile/send-otp
 * @access  Public
 */



/**
 * @desc    Send OTP for phone login/signup
 * @route   POST /v1/api/auth/mobile/send-otp
 * @access  Public
 */
export const mobileAuth = async (req, res) => {
  try {
    const { name, phone } = req.body;

    /**
     * Step 1: Validate phone number
     */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required",
      });
    }

    /**
     * Step 2: Generate OTP
     */
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    /**
     * Step 3: Check if user exists
     */
    let user = await User.findOne({ phone });

    if (!user && !name) {
      return res.status(400).json({
        success: false,
        message: "User name is required"
      })
    }

    if (!user) {
      // Signup flow (create user without password)
      user = await User.create({
        phone,
        phoneOTP: hashedOTP,
        phoneOTPExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      });
    } else {
      // Login flow
      user.phoneOTP = hashedOTP;
      user.phoneOTPExpires = Date.now() + 5 * 60 * 1000;
      await user.save();
    }

    /**
     * Step 4: Send OTP (SMS service later)*/

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully via sms",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Verify OTP for phone login/signup
 * @route   POST /v1/api/auth/mobile/verify-otp
 * @access  Public
 */
export const otpVerification = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    /**
     * Step 1: Validate input
     */
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    /**
     * Step 2: Find user
     */
    const user = await User.findOne({ phone });

    if (!user || !user.phoneOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    /**
     * Step 3: Check OTP expiry
     */
    if (user.phoneOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    /**
     * Step 4: Compare OTP
     */
    const hashedOTP = hashOTP(otp);

    if (hashedOTP !== user.phoneOTP) {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    /**
     * Step 5: Clear OTP & update login info
     */
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        phone: user.phone,
        registeredAt: user.registeredAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


