import express from "express";
import {
  addProfile,
  getProfile,
  updateProfile,
  updateProfilePassword,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/add-profile", addProfile);

router.get("/get-profile", getProfile);

router.put("/update-profile", updateProfile);

router.put("/update-password", updateProfilePassword);

export default router;
