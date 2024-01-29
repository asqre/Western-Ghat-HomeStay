import contactFormModel from "../models/contactForm.model.js";
import { filterObject } from "../utils/filterObject.js";

export const addContactForm = async (req, res) => {
  try {
    const { name, email, phone,country_code, message } = req.body;

    if (!name || !email) {
      return res.status(400).send({
        message: "Name or Email are required fields.",
      });
    }

    const contactForm = await new contactFormModel({
      name,
      email,
      phone,
      country_code,
      message,
    }).save();

    res.status(200).send({
      success: true,
      message: "Contact form uploaded successfully.",
      contactForm,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getContactForm = async (req, res) => {
  try {
    const contactForm = await contactFormModel.find({});
    res.status(200).send({
      success: true,
      contactForm,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const updateContactForm = async (req, res) => {
  try {
    const { _id } = req.body;
    const data = filterObject(req.body, ["_id"]);

    if (!_id) {
      return res.status(400).send({
        success: false,
        message: "_id is required.",
      });
    }

    const updatedContactForm = await contactFormModel.findByIdAndUpdate(
      _id,
      { ...data },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Updated successfully.",
      updatedContactForm,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
