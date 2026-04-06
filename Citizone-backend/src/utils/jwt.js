import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {String} userId - MongoDB user _id
 * @returns {String} JWT token

/**
 * Set auth cookie based on role
 */
export const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie('citizoneCookie', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  return token;
};
