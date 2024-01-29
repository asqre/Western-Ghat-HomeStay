import axios from "axios";
import { BASE_URL } from "./auth";

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

export const getBookingtStatics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/statics`);
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

export const updateBookingDetails = async ({ id, data }) => {
  try {
    if (!data) return alert("Please provide data");
    const response = await axios.post(
      `${BASE_URL}/booking/update-booking/${id}`,
      { ...data }
    );
    return response.data.booking;
  } catch (error) {
    throw error;
  }
};

export const newBookingDetails = async ({ data }) => {
  try {
    if (!data) return alert("Please provide data");
    const response = await axios.post(`${BASE_URL}/booking/book-room`, {
      ...data,
    });
    return response.data.booking;
  } catch (error) {
    throw error;
  }
};
