import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
const router = express.Router();

router.post("/image", uploadImage.single("image"), (req, res) => {
  res.json({ url: req.file.path });
});

export default router;
