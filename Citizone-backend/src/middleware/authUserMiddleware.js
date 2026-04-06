import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

/**
 * Protect user routes (JWT via httpOnly cookie)
 */
export const protectUserRoute = async (req, res, next) => {
	try {
		// Get token from cookies
		const token = req.cookies["citizoneCookie"];

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - No token provided",
			});
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Find user from token payload
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - User not found",
			});
		}

		// Attach user to request
		req.user = user;

		next();
	} catch (error) {
		console.error("JWT auth error:", error.message);

		return res.status(401).json({
			success: false,
			message: "Unauthorized - Invalid or expired token",
		});
	}
};
