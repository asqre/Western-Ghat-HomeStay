import axios from "axios";
import { authConfig } from "@/apiClient/auth";
import { toast } from "sonner";
const BASE_URL = process.env.API_BASE;

export const postContactForm = async ({name, email, phone, country_code, message}) => {
if(!name){
    toast.error("Name is required",)
    return;
}
if(!email){
    toast.error("Email is required")
    return;
}
if(!country_code){
    toast.error("Country code is required")
    return;
}

  try {
    const response = await axios.post(`${BASE_URL}/contactForm/add-contact-form`, {name, email, phone, country_code, message});
  return response;
  } catch (error) {
    throw error;
  }
};
