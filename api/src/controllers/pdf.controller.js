import util from "util";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bookingModel from "../models/booking.model.js";
import htmlToPdf from "../helpers/pdf-to-html.js";

const formatDate = (inputDate) => {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return new Date(inputDate).toLocaleDateString("en-US", options);
};
function calculateNights(checkinDate, checkoutDate) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const timeDifference = checkout - checkin;
  const nights = Math.floor(timeDifference / oneDayInMilliseconds);
  return nights;
}
const pdfOptions = {
  format: "A4", // Set the page size to A4
  orientation: "portrait",
  height: "297mm", // A4 height
  width: "210mm", // A4 width
  pages: "1",
};

export const generateBookingPDF = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);

    if (
      !booking &&
      (booking.isCanceled.isCanceled || booking.paymentStatus === "failed")
    )
      return res.status(404).json({
        success: false,
        message: "PDF Not found",
      });
    const readFile = util.promisify(fs.readFile);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = join(__dirname, "../templates/invoice.html");
    let htmlTemplate = await readFile(templatePath, "utf-8");
    const formattedCheckIn = await formatDate(booking.checkIn);
    const formattedCheckOut = await formatDate(booking.checkOut);
    const totalPrice = (await booking.total_rent) + booking.total_tax;
    const numberOfNights = calculateNights(booking.checkIn, booking.checkOut);
    htmlTemplate = await htmlTemplate
      .replace("{{checkIn}}", formattedCheckIn)
      .replace("{{checkOut}}", formattedCheckOut)
      .replace("{{totalPrice}}", totalPrice)
      .replace("{{GuestName}}", booking.bookedBy)
      .replace("{{paymentMethod}}", booking.payment_method)
      .replace(
        "{{totalGuest}}",
        booking?.numberOfAdults + booking?.numberOfKids
      )
      .replace("{{totalNights}}", numberOfNights)
      .replace("{{total_rent}}", booking.total_rent)
      .replace("{{total_tax}}", booking.total_tax);

    // return res.send(htmlTemplate);
    const pdfBuffer = await htmlToPdf(htmlTemplate);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Internal Server Error");
  }
};
