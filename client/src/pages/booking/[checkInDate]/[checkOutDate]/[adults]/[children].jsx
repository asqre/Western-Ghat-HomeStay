import React, { useEffect, useRef, useState } from "react";
import classes from "./style.module.css";
import MainLayout from "@/layouts/Main";
import Link from "next/link";
import countries from "@/data/countries.json";
import Image from "next/image";
import bookingSm from "@/assets/booking-sm.png";
import { useRouter as Navigation } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import f1 from "@/assets/features2/1.svg";
import f2 from "@/assets/features2/2.svg";
import f3 from "@/assets/features2/3.svg";
import f4 from "@/assets/features2/4.svg";
import f5 from "@/assets/features2/5.svg";
import f6 from "@/assets/features2/6.svg";
import { bookRoom, getRazorpayAPIKey } from "@/apiClient/payment";
import { useMutation, useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import { bookingFormSchema } from "@/schemas/booking";
import { getAdminProfile } from "@/apiClient/profile";
import LoadingFull from "@/components/LoadingFull";
import IndianDate from "@/utils/date";

export default function BookingPage({
  checkInDate,
  checkOutDate,
  adults,
  children,
}) {
  const navigation = Navigation();

  const initialForm = {
    title: "Mr",
    first_name: "",
    last_name: "",
    email: "",
    country_code: "91",
    mobile_no: "",
  };
  let [forms, setForms] = useState([initialForm]);
  const addNewForm = () => {
    const uniqueId = uuidv4();
    setForms([...forms, { initialForm, id: uniqueId }]);
  };
  const removeLastForm = (id) => {
    const guests = formik.values.guestInfo.filter((guest) => guest.id !== id);
    formik.setFieldValue("guestInfo", [...guests]);
  };

  const features = [
    {
      svg: f1,
      title: "Located in the heart of the brisbane",
    },
    {
      svg: f2,
      title: "Great for activities",
    },
    {
      svg: f3,
      title: "Great swimming pool",
    },
    {
      svg: f4,
      title: "Sparkling clean ",
    },
    {
      svg: f5,
      title: "Excellent room comfort & quality",
    },
    {
      svg: f6,
      title: "Car parking",
    },
  ];

  const { data: razorPayAPIKey } = useQuery(
    "razorpay-api-key",
    getRazorpayAPIKey,
    {
      cacheTime: 0,
    }
  );

  const bookRoomMutation = useMutation(bookRoom);
  const { isLoading: isRoomBookingLoading } = bookRoomMutation;

  function validateGuestInfo(guestInfo) {
    return guestInfo.every((info) =>
      Object.values(info).every((value) => value !== "")
    );
  }
  const bookRoomRequest = () => {
    try {
      return bookRoomMutation.mutateAsync({
        checkIn: new IndianDate(checkInDate).toISOString(),
        checkOut: new IndianDate(checkOutDate).toISOString(),
        bookedBy: `${formik?.values.guestInfo[0].first_name} ${formik?.values.guestInfo[0].last_name}`,
        guestInfo: formik.values.guestInfo,
        total_rent: totalAmount,
        total_tax: totalTextAmount,
        numberOfKids: children,
        numberOfAdults: adults,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error occured");
    }
    bookRoomMutation;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const checkoutHandler = async (amount) => {
    try {
      let bookRoomResponse = await bookRoomRequest();
      console.log(bookRoomResponse);
      const res = await initializeRazorpay();

      if (!res) {
        toast.error("Razorpay SDK Failed to load");
        return;
      }

      const options = {
        key: razorPayAPIKey.key,
        amount: bookRoomResponse.order.amount,
        currency: "INR",
        name: "Western Ghat Stay",
        description: "Razorpay Transaction",
        image:
          "https://thumbs.dreamstime.com/b/gradient-fire-phoenix-bird-simple-logo-design-black-bird-simple-logo-design-simple-gradient-fire-phoenix-bird-logo-158339374.jpg",
        order_id: bookRoomResponse.order.id,
        callback_url: `${process.env.API_BASE}/booking/payment-verification?bookingId=${bookRoomResponse.bookingId}`,
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        // handler: function (response) {
        //   console.log("Payment successful:", response);
        // },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(inputDateString) {
    const inputDate = new IndianDate(inputDateString);

    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  function calculateDateDifference(checkInDate, checkOutDate) {
    const startDate = new IndianDate(checkInDate);
    const endDate = new IndianDate(checkOutDate);

    // Calculate the difference in milliseconds
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference;
  }

  const emptyGuest = {
    id: uuidv4(),
    title: "Mr.",
    first_name: "",
    last_name: "",
    email: "",
    country_code: "91",
    phone: "",
  };

  const initialBookingFormValues = {
    guestInfo: [emptyGuest],
  };

  const formik = useFormik({
    initialValues: initialBookingFormValues,
    validationSchema: bookingFormSchema,
    onSubmit: async (values) => {
      try {
        checkoutHandler();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleAddGuest = () => {
    formik.setFieldValue("guestInfo", [...formik.values.guestInfo, emptyGuest]);
  };

  const handleFormSubmit = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0) {
      await formik.handleSubmit();
    } else {
      // Scroll to the first invalid field
      const firstErrorKey = await errors.guestInfo.map((obj) =>
        !obj ? {} : obj
      );
      const arrayOfNames = await firstErrorKey?.flatMap((obj, index) => {
        console.log({ obj, firstErrorKey });
        return Object?.keys(obj).map((key) => `guestInfo.${index}.${key}`);
      });
      if (Array.isArray(arrayOfNames) && arrayOfNames.length > 0) {
        arrayOfNames.forEach((elm) => {
          formik.setFieldTouched(elm, true);
        });
        const firstErrorElement = await document.getElementsByName(
          arrayOfNames?.[0]
        )[0];

        if (firstErrorElement) {
          // await firstErrorElement?.scrollIntoView({
          //   behavior: "smooth",
          //   block: "start",
          // });
          await firstErrorElement.focus();
        }
      }
    }
  };

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery("admin-profile", getAdminProfile);

  const rentPerNight = profileData?.per_night_charge ?? 0;
  const moreAdultRate = profileData?.adults_charge ?? 0;
  const moreChildrenRate = profileData?.kids_charge ?? 0;
  const min_tax_amount = profileData?.min_tax_amount ?? 0;
  const min_tax_percentage = profileData?.min_tax_percentage ?? 0;
  const max_tax_percentage = profileData?.max_tax_percentage ?? 0;
  const adultsCount = Number(adults);
  const childrensCount = Number(children);
  const totalNight = calculateDateDifference(checkInDate, checkOutDate);
  const totalAmount =
    rentPerNight * totalNight +
    (adultsCount > 2 ? (adultsCount - 2) * moreAdultRate : 0) * totalNight +
    (childrensCount > 2 ? (childrensCount - 2) * moreChildrenRate : 0) *
      totalNight;
  const taxPercentage =
    totalAmount <= min_tax_amount ? min_tax_percentage : max_tax_percentage;
  const totalTextAmount =
    totalAmount <= 1000 ? 0 : (totalAmount * taxPercentage) / 100;
  const allTotalAmount = totalAmount + totalTextAmount;

  if (!isProfileLoading && isProfileError) {
    toast.error("Please try again!");
    navigation.push("/");
    return <LoadingFull />;
  }

  return (
    <MainLayout>
      {(isRoomBookingLoading || isProfileLoading) && <LoadingFull />}
      <div className="container m-auto px-[16px] md:px-0">
        <h2 className={classes.main_header}>Booking Details</h2>
        <div className={classes.breadcrumb}>
          <Link href="/">Home</Link>
          <div className={classes.breadcrumb_divider}>/</div>
          <span>Booking Details</span>
        </div>
        <div className={classes.booking_area}>
          <div className={classes.booking_area_left}>
            <h4>Guest Details (adults)</h4>
            <form onSubmit={formik.handleSubmit}>
              {formik.values.guestInfo.map((guest, index) => (
                <div className={classes.guest_card} key={guest.id}>
                  <h5
                    className={
                      index > 0 ? "flex justify-between items-center " : ""
                    }
                  >
                    <span>Guest {index + 1}</span>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeLastForm(guest.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-minus-circle"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8" />
                        </svg>
                      </button>
                    )}
                  </h5>
                  <div className={classes.guest_card_form}>
                    <label className={classes.guest_card_line1}>
                      <span>Full Name</span>
                      <div className="">
                        <div className={classes.guest_card_input_group}>
                          <select
                            name={`guestInfo.${index}.title`}
                            select={guest.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option>Mr.</option>
                            <option>Mrs.</option>
                            <option>Miss</option>
                            <option>Ms.</option>
                          </select>
                          <div>
                            <input
                              type="text"
                              placeholder="First Name"
                              name={`guestInfo.${index}.first_name`}
                              value={guest.first_name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full"
                            />
                            {formik.touched.guestInfo?.[index]?.first_name &&
                              formik.errors.guestInfo?.[index]?.first_name && (
                                <div className="mt-1 text-red-600">
                                  {formik.errors.guestInfo[index]?.first_name}
                                </div>
                              )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Last Name"
                              name={`guestInfo.${index}.last_name`}
                              value={guest.last_name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full"
                            />
                            {formik.touched.guestInfo?.[index]?.last_name &&
                              formik.errors.guestInfo?.[index]?.last_name && (
                                <div className="mt-1 text-red-600">
                                  {formik.errors.guestInfo[index]?.last_name}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className={classes.guest_card_line2}>
                      <span>Email Address</span>
                      <div className={classes.guest_card_input_group}>
                        <input
                          type="email"
                          placeholder="Email"
                          name={`guestInfo.${index}.email`}
                          value={guest.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.guestInfo?.[index]?.email &&
                          formik.errors.guestInfo?.[index]?.email && (
                            <div className="mt-1 text-red-600">
                              {formik.errors.guestInfo[index]?.email}
                            </div>
                          )}
                      </div>
                    </label>
                    <label className={classes.guest_card_line3}>
                      <span>Mobile Number</span>
                      <div className={`${classes["phone-input-field"]}`}>
                        <select
                          name={`guestInfo.${index}.country_code`}
                          select={guest.first_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {countries.map((country) => (
                            <option
                              selected={country.name === "India"}
                              key={country.name}
                            >
                              {country.flag}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          placeholder="Enter Phone Number"
                          name={`guestInfo.${index}.mobile_no`}
                          value={guest.mobile_no}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.guestInfo?.[index]?.mobile_no &&
                        formik.errors.guestInfo?.[index]?.mobile_no && (
                          <div className="mt-1 text-red-600">
                            {formik.errors.guestInfo[index]?.mobile_no}
                          </div>
                        )}
                    </label>
                  </div>
                </div>
              ))}
              {(formik.values.guestInfo?.length ?? 0) < adults && (
                <button
                  type="button"
                  className={classes.add_form_btn}
                  onClick={handleAddGuest}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_439_3895)">
                      <path
                        d="M14.25 9.75H9.75V14.25H8.25V9.75H3.75V8.25H8.25V3.75H9.75V8.25H14.25V9.75Z"
                        fill="#F27501"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_439_3895">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className={classes.add_form_btn}>
                    Add guest information
                  </span>
                </button>
              )}
            </form>
          </div>
          <div className={classes.booking_area_right}>
            <div className={classes.booking_area_right_info}>
              <Image
                src={bookingSm}
                width={432}
                height={204}
                className="mb-[24px] w-full"
                alt=""
              />
              <h5>Western Ghat Home Stay</h5>
              <h6>Post Betkuli Near railway bridge Betkuli Gokarna - 581333</h6>
              <div className={classes.booking_details}>
                <div className={classes.booking_details_tab}>
                  <span>Booking Details</span>
                  <button type="button" onClick={() => navigation.push("/")}>
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_439_3913)">
                        <path
                          d="M8.20167 5.76167L8.73833 6.29833L3.45333 11.5833H2.91667V11.0467L8.20167 5.76167ZM10.3017 2.25C10.1558 2.25 10.0042 2.30833 9.89333 2.41917L8.82583 3.48667L11.0133 5.67417L12.0808 4.60667C12.3083 4.37917 12.3083 4.01167 12.0808 3.78417L10.7158 2.41917C10.5992 2.3025 10.4533 2.25 10.3017 2.25ZM8.20167 4.11083L1.75 10.5625V12.75H3.9375L10.3892 6.29833L8.20167 4.11083Z"
                          fill="#F27501"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_439_3913">
                          <rect
                            width="14"
                            height="14"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>EDIT</span>
                  </button>
                </div>
                <div className={classes.booking_details_tab2}>
                  <div className={classes.booking_details_tab2_item}>
                    <span>CheckIn</span>
                    <div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_440_4707)">
                          <path
                            d="M4.08333 6.41666H5.25V7.58332H4.08333V6.41666ZM12.25 3.49999V11.6667C12.25 12.3083 11.725 12.8333 11.0833 12.8333H2.91667C2.26917 12.8333 1.75 12.3083 1.75 11.6667L1.75583 3.49999C1.75583 2.85832 2.26917 2.33332 2.91667 2.33332H3.5V1.16666H4.66667V2.33332H9.33333V1.16666H10.5V2.33332H11.0833C11.725 2.33332 12.25 2.85832 12.25 3.49999ZM2.91667 4.66666H11.0833V3.49999H2.91667V4.66666ZM11.0833 11.6667V5.83332H2.91667V11.6667H11.0833ZM8.75 7.58332H9.91667V6.41666H8.75V7.58332ZM6.41667 7.58332H7.58333V6.41666H6.41667V7.58332Z"
                            fill="#8590A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_440_4707">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div>{formatDate(checkInDate)}</div>
                    </div>
                  </div>
                  <div className={classes.booking_details_tab2_item}>
                    <span>CheckOut</span>
                    <div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_440_4707)">
                          <path
                            d="M4.08333 6.41666H5.25V7.58332H4.08333V6.41666ZM12.25 3.49999V11.6667C12.25 12.3083 11.725 12.8333 11.0833 12.8333H2.91667C2.26917 12.8333 1.75 12.3083 1.75 11.6667L1.75583 3.49999C1.75583 2.85832 2.26917 2.33332 2.91667 2.33332H3.5V1.16666H4.66667V2.33332H9.33333V1.16666H10.5V2.33332H11.0833C11.725 2.33332 12.25 2.85832 12.25 3.49999ZM2.91667 4.66666H11.0833V3.49999H2.91667V4.66666ZM11.0833 11.6667V5.83332H2.91667V11.6667H11.0833ZM8.75 7.58332H9.91667V6.41666H8.75V7.58332ZM6.41667 7.58332H7.58333V6.41666H6.41667V7.58332Z"
                            fill="#8590A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_440_4707">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div>{formatDate(checkOutDate)}</div>
                    </div>
                  </div>
                </div>
                <div className={classes.booking_details_tab3}>
                  <div className={classes.booking_details_tab3_item}>
                    <b>{totalNight} </b>
                    <span>Total</span>
                  </div>
                  <div className={classes.booking_details_tab3_divider} />
                  <div className={classes.booking_details_tab3_item}>
                    <b>{adults} </b>
                    <span>Adults</span>
                  </div>
                  <div className={classes.booking_details_tab3_divider} />
                  <div className={classes.booking_details_tab3_item}>
                    <b>{children} </b>
                    <span>Kids</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.booking_area_right_price}>
              <h4>Price Breakup</h4>
              <ul>
                <li>
                  <span>{totalNight} Night</span>
                  <span>₹ {totalAmount}</span>
                </li>
                <li>
                  <span>Taxes</span>
                  <span>₹ {totalTextAmount}</span>
                </li>
              </ul>
              <div className={classes.booking_area_right_price_overall}>
                <span>
                  {/* {calculateDateDifference(checkInDate, checkOutDate)} Night */}
                  Total
                </span>
                <span>₹ {allTotalAmount}</span>
              </div>
            </div>
            <div
              className={`${classes.booking_area_right_notice} text-[#FF3333]`}
            >
              <h5>Cancellation</h5>
              <p>
                Non-Refundable : On Cancellation you will not get any refund
              </p>
              {/* <a>Cancellation Policy</a> */}
            </div>
            <button className={classes.paynow_btn} onClick={handleFormSubmit}>
              <span>Proceed to pay</span>
              <span>&#8377; {allTotalAmount}</span>
            </button>
          </div>
        </div>
        <div className={classes.information_area}>
          <h2>Important Information</h2>
          <ul>
            <li>
              Passport, Aaadhar and Driving Licence are accepted as ID proof(s){" "}
            </li>
            <li>
              Guests are responsible for any damages caused to the room or hotel
              property during their stay
            </li>
            <li>
              Guests are responsible for their own behaviour and the behaviour
              of their guests.
            </li>
            <li>
              Guests must respect the property and the privacy of other guests.
            </li>
            <li>
              Smoking allowed in designated areas: Smoking is only permitted in
              designated outdoor areas.
            </li>
            <li>
              Guests are responsible for any damages they cause to the property.
            </li>
            <li>
              We reserve the right to evict any guest who violates these Terms
              or who engages in disruptive or illegal behaviour.
            </li>
            <li>
              Pets allowed: We welcome well-behaved pets with prior approval.
            </li>
            <li>
              If you have any questions about these Terms, please contact us at:
              <a
                href="tel:+918618338785"
                className="text-sm text-blue-500 inline-block ml-1 hover:underline"
              >
                +91-8618338785
              </a>
            </li>
          </ul>
          <Link href="/terms-and-condition">Terms and Conditions</Link>
        </div>
        <section className={`${classes.features}`}>
          <div
            className={`${classes.featuresContainer} container m-auto grid justify-center`}
          >
            {features.map((item) => (
              <div className={classes.features_item} key={item.title}>
                <div className="inline m-auto">
                  {<Image src={item.svg} width={70} height={70} alt="" />}
                </div>
                <span className="text-center">{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps = async (context) => {
  const { params } = context;

  return {
    props: {
      ...params,
    },
  };
};
