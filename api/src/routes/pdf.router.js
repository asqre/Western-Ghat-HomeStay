import express from "express";
import { generateBookingPDF } from "../controllers/pdf.controller.js";

const router = express.Router();

router.get("/booking/:id", generateBookingPDF);

export default router;
