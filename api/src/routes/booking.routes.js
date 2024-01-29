import express from "express";
import {
  availabilityCalendar,
  bookRoom,
  bookingHistory,
  cancelBooking,
  paymentVerification,
  updateGuestInfo,
  updateRefundStatus,
  viewBookingById,
  updateBookingById,
  availability,
  statics,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/book-room", bookRoom);

router.get("/view-booking/:id", viewBookingById);

router.post("/update-booking/:id", updateBookingById);

router.post("/payment-verification", paymentVerification);

router.put("/update-guest/:paymentId/:guestIndex", updateGuestInfo);

router.patch("/cancel-booking/:bookingId", cancelBooking);

router.patch("/update-refund-status/:bookingId", updateRefundStatus);

router.post("/booking-history", bookingHistory);

router.get("/availability-calendar", availabilityCalendar);

router.get("/availability", availability);

router.get("/statics", statics);

export default router;
