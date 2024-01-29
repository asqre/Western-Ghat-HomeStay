import axios from "axios";
import { BASE_URL } from "./auth";

export const getAdminProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile/get-profile`);
    return response.data.profile;
  } catch (error) {
    throw error;
  }
};

export const updateAdminProfile = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/profile/update-profile`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminPassword = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/profile/update-password`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
