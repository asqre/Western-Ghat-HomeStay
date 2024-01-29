import * as Yup from "yup";

export const contactUsValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.number("Phone should not contain letters").required(
    "Phone number is required"
  ),
  message: Yup.string().required("Message is required"),
});
