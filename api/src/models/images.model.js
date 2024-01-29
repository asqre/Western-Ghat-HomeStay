import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
    },
    image_type: {
      type: String,
      required: true,
      enum: ["banner", "gallery", "showcase"],
    },
    alt_text: {
      type: String,
      default: "",
    },
    video_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("images", imagesSchema);
