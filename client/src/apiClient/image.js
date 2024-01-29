import axios from "axios";
const BASE_URL = process.env.API_BASE;

export const getImages = async (image_type) => {
  try {
    const response = await axios.get(`${BASE_URL}/image/get-all/${image_type}`);
    return response.data.images;
  } catch (error) {
    throw error;
  }
};
