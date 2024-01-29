import ImageModel from "../models/images.model.js";
import { filterObject } from "../utils/filterObject.js";

export const addImage = async (req, res) => {
  try {
    const { image_url, image_type, alt_text, video_id } = req.body;

    if (!image_url && !video_id) {
      return res.status(400).send({
        message: "image_url or video_id any required",
        image_url,
        video_id,
      });
    }
    if (!image_type) {
      return res.status(400).send({ message: "image_type is requreid" });
    }

    const image = await new ImageModel({
      image_url,
      image_type,
      alt_text,
      video_id,
    }).save();

    res.status(200).send({
      success: true,
      message: "Image added successfully",
      image,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getImages = async (req, res) => {
  try {
    const { image_type } = req.params;

    if (
      image_type !== "banner" &&
      image_type !== "gallery" &&
      image_type !== "showcase"
    )
      return res.status(400).json({
        success: false,
        message: "Invalid image_type",
      });

    if (!image_type)
      return res.status(400).json({
        success: false,
        message: "image_type is required!",
      });

    const images = await ImageModel.find({ image_type });

    res.status(200).send({
      success: true,
      images,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = filterObject(req.body, ["_id"]);

    const updatedImage = await ImageModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
    if (updatedImage) {
      return res.status(200).send({
        success: true,
        message: "Updated successfully",
        updatedImage,
      });
    }

    const isIdValid = ImageModel.findById(id);

    if (!isIdValid) {
      return res.status(404).json({ message: "invalid image _id" });
    }
  } catch (error) {
    console.log("error");
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ImageModel.findByIdAndDelete(id);

    if (!image)
      return res.status(404).json({
        success: false,
        message: "Invalid image id",
      });
    res.status(200).send({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
