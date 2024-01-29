import axios from "axios";
import { BASE_URL } from "./auth";

export const getBookingHistory = async (startDate, endDate) => {
  try {
    const res = await axios.post(`${BASE_URL}/booking/booking-history`, {
      startDate,
      endDate,
    });
    return res.data.bookingHistory;
  } catch (error) {
    console.log(error);
  }
};
