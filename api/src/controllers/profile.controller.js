import profileModel from "../models/profile.model.js";
import { filterObject } from "../utils/filterObject.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

export const addProfile = async (req, res) => {
  try {
    const admin_password_hash = await hashPassword(req.body.admin_password);

    const profileExist = await profileModel.findOne();

    if (profileExist) {
      return res.status(400).json({
        success: false,
        message: "Profile already exits",
      });
    }

    const profile = await new profileModel({
      ...req.body,
      admin_password_hash,
    }).save();

    if (!profile) {
      return res.status(404).send({
        success: true,
        message: "Failed to upload",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Uploaded successfully",
      profile,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOne();

    if (profile) {
      return res.status(200).json({
        success: true,
        profile,
      });
    }
    return res.status(404).json({
      success: false,
      message: "no profile found",
      hint: "import document dump",
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = filterObject(req.body, ["_id", "admin_password_hash"]);

    const updatedProfile = await profileModel.findOneAndUpdate({}, data, {
      new: true,
    });

    res.status(200).send({
      success: true,
      message: "Updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.log("error");
    res.status(500).send({ success: false, message: error.message });
  }
};

export const updateProfilePassword = async (req, res) => {
  try {
    const { admin_password_current, admin_password_new } = req.body;

    if (!admin_password_current || !admin_password_new)
      return res.status(400).json({
        message: "required fields are missing!",
        success: false,
      });
    const profile = await profileModel.findOne();

    const isValidPassword = await comparePassword(
      admin_password_current,
      profile.admin_password_hash
    );
    console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid current password",
        success: false,
      });
    }
    const admin_password_hash = await hashPassword(admin_password_new);
    const updatedProfile = await profileModel.findOneAndUpdate(
      {},
      { admin_password_hash }
    );

    if (!updatedProfile) {
      return res.status(400).json({
        success: false,
        message: "Failed to update",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};
