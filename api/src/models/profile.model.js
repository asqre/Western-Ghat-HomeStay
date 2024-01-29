import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    admin_email: {
      type: String,
      required: true,
    },
    admin_password_hash: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    social_media: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    per_night_charge: { type: Number, default: 0 },
    adults_charge: { type: Number, default: 0 },
    kids_charge: { type: Number, default: 0 },
    min_tax_amount: { type: String, default: 7000 },
    min_tax_percentage: { type: Number, default: 12 },
    max_tax_percentage: { type: Number, default: 18 },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
