// Import modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/authRoutes.js";

const app = express();

// ====== MIDDLEWARES ======

// JSON parser
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ====== ROUTES ======

// Health check
app.get("citizone/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running 🚀",
  });
});

// Auth routes
app.use("/citizone/v1/api/auth", authRoutes);

// ====== EXPORT APP ======
export default app;
