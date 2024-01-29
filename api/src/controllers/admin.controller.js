import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import adminModel from "../models/profile.model.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { admin_email, adminPassword } = req.body;

    if (!admin_email) {
      return res.send({ message: "Email is required" });
    }
    if (!adminPassword) {
      return res.send({ message: "Password is required" });
    }

    const existingUser = await adminModel.findOne({ admin_email }); // findOne is method for finding one request of email

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    const hashedPassword = await hashPassword(adminPassword);

    const user = await new adminModel({
      admin_email,
      adminPassword: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;

    if (!admin_email || !admin_password) {
      return res.status(404).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await adminModel.findOne({ admin_email });

    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await comparePassword(
      admin_password,
      admin.admin_password_hash
    );

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await JWT.sign(
      { _id: admin._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).send({
      success: true,
      message: "login successfully",
      admin: {
        _id: admin._id,
        email: admin.admin_email,
        role: "admin",
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { admin_email, adminPassword, newPassword } = req.body;
    if (!admin_email) {
      res.status(400).send({
        message: "Email is required.",
      });
    }
    if (!adminPassword) {
      res.status(400).send({
        message: "Answer is required.",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is required.",
      });
    }

    const admin = await adminModel.findOne({ admin_email, adminPassword });

    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await adminModel.findByIdAndUpdate(admin._id, { adminPassword: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Not found any protected routes",
      error,
    });
  }
};
