import bookingModel from "../models/booking.model.js";
import { instance } from "../server.js";
import crypto from "crypto";
import util from "util";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sendEmail } from "../services/sendEmail.service.js";
import axios from "axios";
import moment from "moment";

export const bookRoom = async (req, res, next) => {
  try {
    const {
      checkIn,
      checkOut,
      bookedBy,
      guestInfo,
      total_rent,
      total_tax,
      numberOfKids,
      numberOfAdults,
      isOnline,
      paymentStatus,
    } = req.body;

    const newBooking = new bookingModel({
      checkIn,
      checkOut,
      bookedBy,
      guestInfo,
      total_rent,
      total_tax,
      numberOfKids,
      numberOfAdults,
      isOnline,
      paymentStatus,
    });

    const savedBooking = await newBooking.save();
    const totalAmount = savedBooking.total_rent + savedBooking.total_tax;
    const options = {
      amount: Number(totalAmount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).send({
      success: true,
      message: "Room booked successfully. Payment initiated.",
      order,
      bookingId: newBooking._id,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Not found",
      });

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error",
    });
  }
};

export const viewBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Not found",
      });

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error",
    });
  }
};

const formatDate = (inputDate) => {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return new Date(inputDate).toLocaleDateString("en-US", options);
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const { bookingId } = req.query;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const existingBooking = await bookingModel.findById(bookingId);

    if (!existingBooking) {
      return res
        .status(404)
        .send({ success: false, message: "Booking not found" });
    }

    if (isAuthentic) {
      const razorpayApiResponse = await axios.get(
        `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
        {
          auth: {
            username: process.env.RAZORPAY_API_KEY,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
        }
      );

      const updatedPayment = await bookingModel.findByIdAndUpdate(
        bookingId,
        {
          isOnline: true,
          bookedBy: `${existingBooking.guestInfo[0].first_name} ${existingBooking.guestInfo[0].last_name}`,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          payment_method: razorpayApiResponse?.data?.method,
          paymentStatus: "success",
        },
        { new: true }
      );

      const guestEmails = updatedPayment.guestInfo.map((guest) => guest.email);
      const formattedCheckIn = formatDate(updatedPayment.checkIn);
      const formattedCheckOut = formatDate(updatedPayment.checkOut);
      const totalPrice = updatedPayment.total_rent + updatedPayment.total_tax;

      function calculateNights(checkinDate, checkoutDate) {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const timeDifference = checkout - checkin;
        const nights = Math.floor(timeDifference / oneDayInMilliseconds);
        return nights;
      }

      const numberOfNights = calculateNights(
        updatedPayment.checkIn,
        updatedPayment.checkOut
      );
      console.log(`Number of nights: ${numberOfNights}`);

      try {
        const emailPromises = [];
        const readFile = util.promisify(fs.readFile);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const templatePath = join(__dirname, "../templates/new-invoice.html");
        const template = await readFile(templatePath, "utf-8");

        for (const guest of updatedPayment.guestInfo) {
          const replacedTemplate = template
            .replace("{{GuestName}}", `${guest.first_name} ${guest.last_name}`)
            .replace("{{totalNights}}", numberOfNights)
            .replace("{{total_rent}}", updatedPayment.total_rent)
            .replace("{{total_tax}}", updatedPayment.total_tax)
            .replace("{{checkIn}}", formattedCheckIn)
            .replace("{{checkOut}}", formattedCheckOut)
            .replace("{{totalPrice}}", totalPrice)
            // .replace("{{bookedBy}}", updatedPayment.bookedBy)
            // .replace("{{paymentMethod}}", updatedPayment.payment_method)
            // .replace(
            //   "{{download_url}}",
            //   `${process.env.API_BASE}/pdf/booking/${updatedPayment?._id}`
            // )
            .replace(
              "{{totalGuest}}",
              guest.number_of_adults + guest.number_of_kids
            );

          const emailPromise = sendEmail({
            sender: {
              email: "wghomestay@gmail.com",
              name: "Western Ghat Home Stay",
            },
            to: [{ email: guest.email }],
            subject: "Booking Confirmation",
            htmlContent: replacedTemplate,
          });

          emailPromises.push(emailPromise);
        }

        await Promise.all(emailPromises);
      } catch (error) {
        console.log("sendEmail: ", error);
      }

      res.redirect(
        302,
        `${process.env.CLIENT_URL}/success/${updatedPayment._id}`
      );
    } else {
      await bookingModel.findByIdAndUpdate(
        bookingId,
        { paymentStatus: "failed" },
        { new: true }
      );

      res.status(400).json({ success: false, message: "Invalid payment" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateGuestInfo = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const guestIndex = req.params.guestIndex;

    const payment = await bookingModel.findById(paymentId);

    if (!payment) {
      return res
        .status(404)
        .send({ success: false, message: "Payment not found" });
    }

    if (guestIndex < 0 || guestIndex >= payment.guestInfo.length) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid guest index" });
    }

    const { title, first_name, last_name, email, mobile_no, country_code } =
      req.body;

    payment.guestInfo[guestIndex] = {
      title,
      first_name,
      last_name,
      email,
      mobile_no,
      country_code,
    };

    const updatedBooking = await payment.save();

    res.status(200).send({
      success: false,
      message: "Guest information updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .send({ success: false, message: "Booking not found" });
    }

    if (booking.isCanceled.isCanceled) {
      return res
        .status(400)
        .send({ success: false, message: "Booking is already canceled" });
    }

    booking.isCanceled.isCanceled = true;
    booking.isCanceled.refundStatus = "processing";

    const updatedBooking = await booking.save();
    res.status(200).send({
      success: true,
      message: "Booking canceled successfully.",
      updatedBooking,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateRefundStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { refundStatus } = req.body;

    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (!booking.isCanceled.isCanceled) {
      return res
        .status(400)
        .json({ success: false, message: "Booking is not canceled" });
    }

    booking.isCanceled.refundStatus = refundStatus;

    const updatedBooking = await booking.save();

    res.status(200).send({
      success: true,
      message: "Refund status updated successfully",
      updatedBooking,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getBookingStatus = (date, bookings) => {
  for (const booking of bookings) {
    if (date >= booking.checkIn && date < booking.checkOut) {
      return "checkin";
    } else if (date === booking.checkOut) {
      return "checkout";
    }
  }
  return "none"; // If the date doesn't match any check-in or check-out
};

export const bookingHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).send({
        success: false,
        message: "Both start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const bookingHistory = await bookingModel
      .find({
        createdAt: { $gte: start, $lte: end },
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Booking history retrieved successfully",
      bookingHistory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// room availability
export const availabilityCalendar = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res
        .status(400)
        .send({ success: false, message: "Both year and month are required" });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    const bookingsWithinMonth = await bookingModel.find({
      $or: [
        { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
      ],
      paymentStatus: "success",
      isCanceled: {
        isCanceled: false,
      },
    });

    const daysCount = new Date(year, month + 1, 0).getDate();
    const monthDates = Array.from({ length: daysCount }, (_, index) => {
      console.log(`${year} ${month}, ${index + 1}`);
      const date = new Date(year, month - 1, index + 1 + 1);
      return date;
    });
    const calendar = [];
    monthDates.forEach((date) => {
      calendar.push({
        date: date,
        dateObject: {
          day: new Date(date).getUTCDate(),
          month: new Date(date).getUTCMonth(),
          year: new Date(date).getUTCFullYear(),
        },
        isAvailable: isDateAvailable(date, bookingsWithinMonth),
      });
    });

    res.status(200).send({ success: true, calendar });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const availability = async (req, res) => {
  try {
    const { month, year } = req.query;
    let startOfMonth = new Date(year, month - 1, 1, 5, 30, 0, 0);
    let endOfMonth = new Date(year, month, 0, 5, 30, 0, 0);

    const bookings = await bookingModel.find({
      $or: [
        {
          $and: [
            { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
            { isCanceled: { isCanceled: false }, paymentStatus: "success" }, // Filter out canceled and paymentStatus failed/refuned bookings
          ],
        },
        {
          $and: [
            { checkIn: { $lt: startOfMonth } },
            { checkOut: { $lte: startOfMonth } },
            { isCanceled: { isCanceled: false }, paymentStatus: "success" }, // Filter out canceled and paymentStatus failed/refuned bookings
          ],
        },
      ],
    });

    const result = [];

    for (
      let date = startOfMonth;
      date <= endOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const isBooked = bookings.some(
        (booking) => date >= booking.checkIn && date < booking.checkOut
      );
      const isCheckIn = bookings.some(
        (booking) =>
          date.getFullYear() === booking.checkIn.getFullYear() &&
          date.getDate() === booking.checkIn.getDate() &&
          date.getMonth() === booking.checkIn.getMonth() &&
          date.getTime() < booking.checkOut.getTime()
      );

      result.push({
        date: new Date(date),
        dateFormat: new Date(date).toLocaleDateString(),
        isBooked,
        isCheckIn,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function isDateAvailable(date, bookingsWithinMonth) {
  return !bookingsWithinMonth.some(
    (booking) => date >= booking.checkIn && date <= booking.checkOut
  );
}

// function calculatePercentageGrowth(current, last) {
//   const currentVal = current[0]?.totalRevenue || 0;
//   const lastVal = last[0]?.totalRevenue || 0;

//   return ((currentVal - lastVal) / lastVal) * 100;
// }

function calculatePercentageGrowth(current, last) {
  const currentVal = current[0]?.totalRevenue || 0;
  const lastVal = last[0]?.totalRevenue || 0;

  if (lastVal === 0) {
    // Avoid division by zero
    return currentVal === 0 ? 0 : 100;
  }

  return ((currentVal - lastVal) / lastVal) * 100;
}
export const statics = async (req, res) => {
  try {
    const currentDate = moment();
    const lastMonthDate = moment().subtract(1, "month");
    const lastYearDate = moment().subtract(1, "year");

    // Current Month Revenue with Growth/Loss
    const currentMonthRevenue = await bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().startOf("month").toDate(),
            $lt: moment().endOf("month").toDate(),
          },
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_rent" },
        },
      },
    ]);

    const lastMonthRevenue = await bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonthDate.startOf("month").toDate(),
            $lt: lastMonthDate.endOf("month").toDate(),
          },
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_rent" },
        },
      },
    ]);

    const currentMonthGrowth = calculatePercentageGrowth(
      currentMonthRevenue,
      lastMonthRevenue
    );

    // Current Year Revenue with Growth/Loss
    const currentYearRevenue = await bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().startOf("year").toDate(),
            $lt: moment().endOf("year").toDate(),
          },
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_rent" },
        },
      },
    ]);

    const lastYearRevenue = await bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastYearDate.startOf("year").toDate(),
            $lt: lastYearDate.endOf("year").toDate(),
          },
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_rent" },
        },
      },
    ]);

    const currentYearGrowth = calculatePercentageGrowth(
      currentYearRevenue,
      lastYearRevenue
    );

    // Total Bookings of Current Month with Growth/Loss
    const currentMonthBookings = await bookingModel.countDocuments({
      createdAt: {
        $gte: moment().startOf("month").toDate(),
        $lt: moment().endOf("month").toDate(),
      },
      "isCanceled.isCanceled": false,
      paymentStatus: "success",
    });

    const lastMonthBookings = await bookingModel.countDocuments({
      createdAt: {
        $gte: lastMonthDate.startOf("month").toDate(),
        $lt: lastMonthDate.endOf("month").toDate(),
      },
      "isCanceled.isCanceled": false,
      paymentStatus: "success",
    });

    const currentMonthBookingsGrowth = calculatePercentageGrowth(
      currentMonthBookings,
      lastMonthBookings
    );

    // Total Bookings of Current Year with Growth/Loss
    const currentYearBookings = await bookingModel.countDocuments({
      createdAt: {
        $gte: moment().startOf("year").toDate(),
        $lt: moment().endOf("year").toDate(),
      },
      "isCanceled.isCanceled": false,
      paymentStatus: "success",
    });

    const lastYearBookings = await bookingModel.countDocuments({
      createdAt: {
        $gte: lastYearDate.startOf("year").toDate(),
        $lt: lastYearDate.endOf("year").toDate(),
      },
      "isCanceled.isCanceled": false,
      paymentStatus: "success",
    });

    const currentYearBookingsGrowth = calculatePercentageGrowth(
      currentYearBookings,
      lastYearBookings
    );

    // Overall Revenue after Paying Tax
    const overallRevenueAfterTax = await bookingModel.aggregate([
      {
        $match: {
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $subtract: ["$total_rent", "$total_tax"] } },
        },
      },
    ]);

    const monthlyBookings = await bookingModel.aggregate([
      {
        $match: {
          "isCanceled.isCanceled": false,
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: "$count" },
          totalMonths: { $sum: 1 },
        },
      },
    ]);

    const averageMonthlyBookings =
      (monthlyBookings[0]?.totalBookings || 0) /
      (monthlyBookings[0]?.totalMonths || 1);

    // Send response
    res.json({
      currentMonthRevenue: {
        value: currentMonthRevenue[0]?.totalRevenue || 0,
        growth: currentMonthGrowth,
      },
      currentYearRevenue: {
        value: currentYearRevenue[0]?.totalRevenue || 0,
        growth: currentYearGrowth,
      },
      currentMonthBookings: {
        value: currentMonthBookings,
        growth: currentMonthBookingsGrowth,
      },
      currentYearBookings: {
        value: currentYearBookings,
        growth: currentYearBookingsGrowth,
      },
      averageMonthlyBookings,
      overallRevenueAfterTax: overallRevenueAfterTax[0]?.totalRevenue || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
