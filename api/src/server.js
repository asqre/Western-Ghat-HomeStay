import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/db.js";
import imagesRoutes from "./routes/images.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import contactFormRoutes from "./routes/contactForm.routes.js";
import Razorpay from "razorpay";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import pdfRoutes from "./routes/pdf.router.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/image", imagesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contactForm", contactFormRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/pdf", pdfRoutes);
app.get("/api/getkey", (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
    success: true,
    message: "Get Razorpay API key from backend to frontend",
  });
});
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to WESTERN GHAT" });
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_MODE} at ${PORT}`);
});
