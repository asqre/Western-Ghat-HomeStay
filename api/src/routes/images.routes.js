import express from "express";
import {
  addImage,
  deleteImage,
  getImages,
  updateImage,
} from "../controllers/images.controller.js";

const router = express.Router();

router.post("/add", addImage);

router.get("/get-all/:image_type", getImages);

router.put("/update/:id", updateImage);

router.delete("/delete/:id", deleteImage);

export default router;
