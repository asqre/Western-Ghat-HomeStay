import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    country_code: {
      type: Number,
      default: 91,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("contactForm", contactFormSchema);
