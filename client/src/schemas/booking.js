import * as Yup from "yup";

export const bookingFormSchema = Yup.object().shape({
  guestInfo: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      country_code: Yup.string().required("Country code is required"),
      mobile_no: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Phone number is required"),
    })
  ),
});
