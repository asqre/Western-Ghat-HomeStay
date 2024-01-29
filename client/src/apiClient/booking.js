import axios from "axios";
const BASE_URL = process.env.API_BASE;

export const getBookingDays = async ({ month, year }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/booking/availability?year=${year}&month=${month}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewBookingDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/view-booking/${id}`);
    return response.data.booking;
  } catch (error) {
    throw error;
  }
};
