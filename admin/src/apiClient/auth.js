import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = import.meta.env.VITE_API_BASE;

const token = Cookies.get("token")
  ? "Bearer " + Cookies.get("token")
  : undefined;
export default token;

export const authConfig = {
  baseURL: BASE_URL,
  headers: {
    credentials: "include",
    Authorization: token,
  },
};

export const adminLogin = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
