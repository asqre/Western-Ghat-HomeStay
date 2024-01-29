import axios from "axios";
import { authConfig } from "@/apiClient/auth";
const BASE_URL = process.env.API_BASE;

export const getRazorpayAPIKey = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getkey`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bookRoom = async ({
  checkIn,
  checkOut,
  bookedBy,
  guestInfo,
  total_rent,
  total_tax,
  numberOfKids,
  numberOfAdults,
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/booking/book-room`, {
      checkIn,
      checkOut,
      bookedBy,
      guestInfo,
      total_rent,
      total_tax,
      numberOfKids,
      numberOfAdults,
      payment_method: "",
    });
    return response.data;
  } catch (error) {
    console.log({ numberOfAdults, numberOfKids });
    throw error;
  }
};
