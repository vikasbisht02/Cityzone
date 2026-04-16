// Import modules
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/authRoutes.js";

const app = express();

// ====== MIDDLEWARES ======

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5001",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    process.env.USER_FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL,
    process.env.SUPER_ADMIN_FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL // Fallback for production
  ].filter(url => url && url.trim() !== ''),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// Enable CORS
app.use(cors(corsOptions));

// JSON parser
app.use(express.json());

// Parse cookies
app.use(cookieParser());

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
