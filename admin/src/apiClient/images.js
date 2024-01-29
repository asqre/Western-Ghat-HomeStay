import axios from "axios";
import { BASE_URL } from "./auth";

export const getImages = async (image_type) => {
  try {
    const response = await axios.get(`${BASE_URL}/image/get-all/${image_type}`);
    return response.data.images;
  } catch (error) {
    throw error;
  }
};

export const uploadImageToCloudinary = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url ?? response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addImage = async (image_url, image_type, video_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/image/add`, {
      image_url,
      image_type,
      video_id,
    });
    return response.data.image ?? response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteImage = async (imageId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/image/delete/${imageId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
