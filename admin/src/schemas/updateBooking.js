import * as Yup from "yup";

export const updateBookingSchema = Yup.object().shape({
  checkIn: Yup.string().required("Check-in date is required"),
  checkOut: Yup.string().required("Check-out date is required"),
  bookedBy: Yup.string().required("Booked by is required"),
  numberOfKids: Yup.number().integer(),
  numberOfAdults: Yup.number().integer(),
  total_rent: Yup.number().positive("Total rent should be a positive number"),
  total_tax: Yup.number().positive("Total tax should be a positive number"),
  isCanceled: Yup.boolean(),
  refundStatus: Yup.string(),
  paymentStatus: Yup.string(),
  guestInfo: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile_no: Yup.string().required("Mobile number is required"),
      country_code: Yup.string().required("Country code is required"),
    })
  ),
});
