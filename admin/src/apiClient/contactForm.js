import axios from "axios";
import { BASE_URL } from "./auth";

export const getContactForm = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/contactForm/get-contact-form`);
    return res.data.contactForm;
  } catch (error) {
    console.log(error);
  }
};
