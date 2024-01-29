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
