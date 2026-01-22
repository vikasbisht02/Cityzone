import mongoose from "mongoose";
import validator from "validator";
import { hashPassword } from "../utils/password.js";

const roles = ["user", "admin", "superadmin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be at most 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [30, "Email must be at most 30 characters"],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => /^\d{10}$/.test(value),
        message: "Invalid phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 13"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female, or others"
      }
    },

    otpVerification: String,
    otpVerificationExpire: Date,
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ===== HASH PASSWORD BEFORE SAVE =====
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
