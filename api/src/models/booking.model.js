import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  mobile_no: { type: String, required: true },
  country_code: { type: String, required: true },
  doc_source: { type: String },
});

const bookingSchema = new mongoose.Schema(
  {
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    bookedBy: { type: String, required: true },
    isOnline: { type: Boolean, default: true },
    guestInfo: [guestSchema],
    total_rent: { type: Number, requried: true },
    total_tax: { type: Number, required: true },
    numberOfKids: { type: Number, default: 0, enum: [0, 1, 2, 3, 4] },
    numberOfAdults: { type: Number, default: 1, enum: [1, 2, 3, 4] },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    isCanceled: {
      isCanceled: { type: Boolean, default: false },
      refundStatus: {
        type: String,
        enum: ["processing", "approved", "issued"],
      },
    },
    payment_method: {
      type: String,
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["success", "failed", "refunded"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("booking", bookingSchema);
