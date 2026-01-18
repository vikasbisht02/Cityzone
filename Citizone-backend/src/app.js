// Import modules
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Create Express app
const app = express();

// ====== MIDDLEWARES ======

// JSON parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ====== ROUTES ======

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running 🚀",
  });
});

// Future API routes can be added here
// e.g., app.use("/api/users", userRoutes);

// ====== EXPORT APP ======
export default app;
