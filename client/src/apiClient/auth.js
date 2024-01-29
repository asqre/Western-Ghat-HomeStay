import Cookies from "js-cookie";
export const BASE_URL = process.env.API_BASE;

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
