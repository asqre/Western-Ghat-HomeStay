import Slider from "react-slick";
import Image from "next/image";
import Head from "next/head";
import MainLayout from "@/layouts/Main";
import classes from "./index.module.css";
import about from "../assets/about.png";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import countries from "../data/countries.json";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { postContactForm } from "@/apiClient/contact";
import { useMutation, useQuery } from "react-query";
import { getBookingDays } from "@/apiClient/booking";
import { getImages } from "@/apiClient/image";
import { useFormik } from "formik";
import { contactUsValidationSchema } from "@/schemas/contact-us";
import Viewer from "@/components/Viewer";
import { addMonths } from "date-fns";
import IndianDate from "@/utils/date";

const initialContactValues = {
  name: "",
  email: "",
  phone: "",
  country_code: "91",
  message: "",
};
export default function Home() {
  const formik = useFormik({
    initialValues: initialContactValues,
    validationSchema: contactUsValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await mutation.mutateAsync(values);
        if (res.status === 200) {
          await resetForm();
          toast.success("Form submitted");
          return;
        }
        toast.error("Failed to submit");
      } catch (error) {
        console.error("Error creating post", error);
      }
    },
  });
  const router = useRouter();
  const initialPrevState = {
    isOpen: false,
    images: [],
    currImg: 0,
  };
  const [prevState, setPrevState] = useState(initialPrevState);
  const [bookingForm, setBookingForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    adults: 2,
    children: 2,
  });

  const openViewer = (images, currImg = 0) => {
    setPrevState({ ...prevState, isOpen: true, images, currImg });
  };
  const closeViewer = () => {
    setPrevState({ ...prevState, isOpen: false, images: [] });
  };
  const gotoPrevious = () => {
    setPrevState({
      ...prevState,
      currImg: prevState.currImg - 1,
    });
  };
  const gotoNext = () => {
    setPrevState({
      ...prevState,
      currImg: prevState.currImg + 1,
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: false,
  };
  const showcaseSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2.3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: "#F4F5F7",
          borderRadius: "10px",
          padding: "80px 0",
          marginBottom: "-160px",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#F27501",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.66,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const updateBookingForm = (key, value) => {
    setBookingForm({
      ...bookingForm,
      [key]: value,
    });
  };

  const handleBookNow = () => {
    const validCheckIn = new IndianDate(bookingForm.checkInDate);
    const validCheckOut = new IndianDate(bookingForm.checkOutDate);

    if (isNaN(validCheckIn.getTime()))
      return toast.error("Invalid check-in date");
    if (isNaN(validCheckOut.getTime()))
      return toast.error("Invalid check-out date");
    router.push({
      pathname: `/booking/${bookingForm.checkInDate.toString()}/${bookingForm.checkOutDate.toString()}/${bookingForm.adults
        }/${bookingForm.children}`,
    });
  };

  const mutation = useMutation(postContactForm);

  const { data: bannerImages } = useQuery("banner-images", () =>
    getImages("banner"),
  );
  const { data: galleryImages } = useQuery("gallery-images", () =>
    getImages("gallery"),
  );
  const { data: showcaseImages } = useQuery("showcase-images", () =>
    getImages("showcase"),
  );

  return (
    <>
      <Head>
        <title>WesternGhat</title>
        <meta name="description" content="WesternGhat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        {prevState.isOpen && (
          <Viewer
            onClose={closeViewer}
            imgIndex={prevState.currImg}
            images={prevState.images.map((img) => ({
              url: img.image_url,
              ...img,
            }))}
          />
        )}
        {/* {prevState.isOpen && (
          <ImageViewer
            src={prevState.images.map((item) => item.image_url)}
            currentIndex={prevState.currImg}
            disableScroll={true}
            closeOnClickOutside={true}
            onClose={closeViewer}
          />
        )} */}
        <main
          id={`${classes["hero-section"]} mb-6 md:mb-0`}
          aria-description="Home page hero section"
          className="relative"
        >
          {Array.isArray(bannerImages) && bannerImages.length > 0 ? (
            <Slider {...settings}>
              {bannerImages?.map((img) => (
                <Image
                  src={img?.image_url}
                  key={img?.image_url}
                  height={724}
                  width={1400}
                  className="h-[300px] md:h-[762px] object-cover"
                  alt=""
                />
              ))}
            </Slider>
          ) : (
            <div className="h-[300px] md:h-[762px] bg-slate-400	" />
          )}
          <div className={`${classes.heroInfo} container`}>
            <div className={classes["title-section"]}>
              <h1>Welcome to Western Ghat</h1>
              <p>
                Beyond accommodations, we offer an experience – because your
                journey deserves the best.
              </p>
            </div>
            <div className={`${classes.heroForm}`}>
              <div className={classes.heroForm_left}>
                <div className="w-full md:w-4/5 m-auto">Book Online</div>
              </div>
              <div className={classes.heroForm_mid}>
                <div className={classes.heroForm_mid_group}>
                  <div className={classes.heroForm_mid_subgroup}>
                    <DatePicker
                      label="Check In Date"
                      type="check-in-date"
                      dateToValidate={bookingForm.checkOutDate}
                      value={bookingForm.checkInDate}
                      setData={(value) => {
                        if (!bookingForm.checkOutDate)
                          return updateBookingForm("checkInDate", value);
                        if (value < bookingForm.checkOutDate) {
                          updateBookingForm("checkInDate", value);
                        } else {
                          toast.error("Check-in date must be before check-out");
                        }
                      }}
                      {...bookingForm}
                    />
                    <DatePicker
                      isCheckOutForm={true}
                      label="Check Out Date"
                      type="check-out-date"
                      tooptipText="select check-out"
                      dateToValidate={bookingForm.checkInDate}
                      value={bookingForm.checkOutDate}
                      setData={(value) => {
                        if (!bookingForm.checkInDate)
                          return updateBookingForm("checkOutDate", value);
                        if (value > bookingForm.checkInDate) {
                          updateBookingForm("checkOutDate", value);
                        } else {
                          toast.error("Check-out date must be after check-in");
                        }
                      }}
                      {...bookingForm}
                    />
                  </div>
                  <div className={classes.heroForm_mid_subgroup}>
                    <label>
                      <span>
                        <span>Adults</span>
                      </span>
                      <div className="relative max-w-sm">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                            className="lucide lucide-user-round w-4 h-4 text-gray-500 dark:text-gray-400"
                          >
                            <circle cx="12" cy="8" r="5" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                          </svg>
                        </div>
                        <select
                          className={`${classes.heroSelect} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5`}
                          defaultValue={bookingForm.adults}
                          onChange={({ target }) =>
                            updateBookingForm("adults", target.value)
                          }
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                    </label>
                    <label>
                      <span>Children</span>
                      <div className="relative max-w-sm">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                            className="lucide lucide-baby w-4 h-4 text-gray-500 dark:text-gray-400"
                          >
                            <path d="M9 12h.01" />
                            <path d="M15 12h.01" />
                            <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                            <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
                          </svg>
                        </div>
                        <select
                          className={`${classes.heroSelect} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5`}
                          defaultValue={bookingForm.children}
                          onChange={({ target }) =>
                            updateBookingForm("children", target.value)
                          }
                        >
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className={classes.heroForm_right}>
                <button
                  type="button"
                  className={classes.heroForm_submitBtn}
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </main>
        <section
          id="about"
          className={`${classes.about} container m-auto hidden`}
        >
          <div className={`${classes.about_left} w-[90%] md:w-2/5`}>
            <h3>About Us</h3>
            <p>
              Escape the bustling city life and immerse yourself in the
              tranquility of nature’s embrace at WesternGardenHomeStay, your
              gateway to serenity and adventure. Our idyllic homestay, nestled
              amidst the picturesque landscapes of Karnataka, offers a unique
              blend of comfort, exploration, and cultural immersion.
            </p>
            <Link href="/about" className="uppercase">
              Read More
            </Link>
          </div>
          <Image
            className={classes.about_right_img}
            src={about}
            width={671}
            alt=""
          />
        </section>
        <section className={`${classes.showcase}`}>
          <div className="container m-auto text-center">
            <h2> Our homestay rooms are your perfect retreat</h2>
            <p className="w-[90%] md:w-3/5 m-auto">
              Step into your personal sanctuary, where every corner whispers a
              tale of comfort and style. Our homestay rooms redefine the
              ordinary, offering a symphony of luxury and homely warmth.
            </p>
          </div>
          <Slider {...showcaseSettings}>
            {showcaseImages?.map((image, index) => {
              return (
                <Image
                  key={image.image_url}
                  src={image.image_url}
                  width={684}
                  height={457}
                  className={`${classes.showcaseImage} md:w-[627px] md:h-[392px] object-cover`}
                  onClick={() => openViewer(showcaseImages, index)}
                  alt=""
                  style={{
                    objectFit: "contain",
                  }}
                />
              );
            })}
          </Slider>
        </section>
        <section className={`${classes.gallery} container m-auto`}>
          <h2>Gallery</h2>
          <div className={classes.galleryWrapper}>
            {galleryImages?.slice(0, 12)?.map((img, index) => (
              <Image
                key={img?.image_url}
                src={
                  img?.image_url
                    ? img.image_url
                    : `https://img.youtube.com/vi/${img?.video_id}/0.jpg`
                }
                width={266}
                height={225}
                className="w-[266px] h-[225px] object-cover"
                onClick={() => openViewer(galleryImages, index)}
                alt={img.alt_text}
              />
            ))}
          </div>
          <Link href="/gallery" className={classes.exploreGalleryBtn}>
            Explore All
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_260_1699)">
                <path
                  d="M8 3.30835L7.06 4.24835L10.78 7.97502H2.66666V9.30835H10.78L7.06 13.035L8 13.975L13.3333 8.64168L8 3.30835Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_260_1699">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.641602)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </section>
        <section className={classes.contactUs} id="contact-us">
          <h2>Contact Us</h2>
          <div className={`container m-auto`}>
            <div
              className={`${classes.contactUsArea} container m-auto xl:w-5/6`}
            >
              <div className={classes.contactUsArea_left}>
                <h3>Let&apos;s start a conversation</h3>
                <p className={classes.subTitle}>
                  Reach out to Us for Inquiries, Reservations, and a Warm
                  Welcome!
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className={classes["input-field"]}
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && formik.errors.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className={classes["input-field"]}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && formik.errors.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className={classes["phone-input-field"]}>
                      <select
                        name="country_code"
                        value={formik.values.country_code}
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
                        // pattern="^\d{10}$"
                        contactForm
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && formik.errors.phone}
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      placeholder="Message"
                      className={`${classes["input-field"]} resize-none`}
                      name="message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {formik.errors.message}
                      </p>
                    )}
                  </div>
                  <button type="submit" className={classes.sendBtn}>
                    Send
                  </button>
                </form>
              </div>
              <div className={classes.contactUsArea_right}>
                <div className={classes.contactUs_details_group}>
                  <div className={classes.contactUs_details_item}>
                    <div>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_260_1731)">
                          <path
                            d="M16 2.66675C10.84 2.66675 6.66666 6.84008 6.66666 12.0001C6.66666 19.0001 16 29.3334 16 29.3334C16 29.3334 25.3333 19.0001 25.3333 12.0001C25.3333 6.84008 21.16 2.66675 16 2.66675ZM9.33333 12.0001C9.33333 8.32008 12.32 5.33341 16 5.33341C19.68 5.33341 22.6667 8.32008 22.6667 12.0001C22.6667 15.8401 18.8267 21.5867 16 25.1734C13.2267 21.6134 9.33333 15.8001 9.33333 12.0001Z"
                            fill="white"
                          />
                          <path
                            d="M16 15.3334C17.8409 15.3334 19.3333 13.841 19.3333 12.0001C19.3333 10.1591 17.8409 8.66675 16 8.66675C14.159 8.66675 12.6667 10.1591 12.6667 12.0001C12.6667 13.841 14.159 15.3334 16 15.3334Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_260_1731">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    Post Betkuli Near railway bridge Betkuli Gokarna - 581333
                  </div>
                  <div className={classes.contactUs_details_item}>
                    <div>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_260_1734)">
                          <path
                            opacity="0.3"
                            d="M25.3333 23.2934C24.16 23.2001 23 23.0001 21.8667 22.6934L20.28 24.2801C21.88 24.8267 23.5867 25.1734 25.3467 25.2801V23.2934H25.3333ZM6.70667 6.66675C6.82667 8.42675 7.17333 10.1201 7.70667 11.7334L9.30666 10.1334C9 9.01341 8.8 7.85341 8.72 6.66675H6.70667Z"
                            fill="white"
                          />
                          <path
                            d="M12.0933 10.0933C11.6 8.6 11.3333 7 11.3333 5.33333C11.3333 4.6 10.7333 4 10 4H5.33333C4.6 4 4 4.6 4 5.33333C4 17.8533 14.1467 28 26.6667 28C27.4 28 28 27.4 28 26.6667V22.0133C28 21.28 27.4 20.68 26.6667 20.68C25.0133 20.68 23.4 20.4133 21.9067 19.92C21.7733 19.8667 21.6267 19.8533 21.4933 19.8533C21.1467 19.8533 20.8133 19.9867 20.5467 20.24L17.6133 23.1733C13.84 21.24 10.7467 18.16 8.82667 14.3867L11.76 11.4533C12.1333 11.08 12.24 10.56 12.0933 10.0933ZM21.8667 22.6933C23 23.0133 24.16 23.2133 25.3333 23.2933V25.28C23.5733 25.16 21.88 24.8133 20.2667 24.28L21.8667 22.6933ZM7.72 11.7333C7.17333 10.12 6.82667 8.42667 6.70667 6.66667H8.70667C8.8 7.85333 9 9.01333 9.32 10.12L7.72 11.7333Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_260_1734">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    +91 8618338785
                  </div>
                  <div className={classes.contactUs_details_item}>
                    <div>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_260_1737)">
                          <path
                            d="M29.3333 7.99992C29.3333 6.53325 28.1333 5.33325 26.6667 5.33325H5.33333C3.86666 5.33325 2.66666 6.53325 2.66666 7.99992V23.9999C2.66666 25.4666 3.86666 26.6666 5.33333 26.6666H26.6667C28.1333 26.6666 29.3333 25.4666 29.3333 23.9999V7.99992ZM26.6667 7.99992L16 14.6666L5.33333 7.99992H26.6667ZM26.6667 23.9999H5.33333V10.6666L16 17.3333L26.6667 10.6666V23.9999Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_260_1737">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    wghomestay@gmail.com
                  </div>
                </div>
                <iframe
                  className="rounded-lg"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1679.1876572752992!2d74.3928277616097!3d14.5321198589546!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe8380d6013dbf%3A0xf2b1119f2ab7fcdb!2sWestern%20Ghat%20Home%20Stay!5e0!3m2!1sen!2sin!4v1702407263642!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}

function DatePicker({
  label = "label here",
  value,
  setData,
  type,
  dateToValidate,
  isCheckOutForm = false,
  checkInDate,
}) {
  const [date, setDate] = useState(new IndianDate());
  const [calandarVisible, setCalandarVisible] = useState(false);
  const [allowedDays, setAllowedDays] = useState([]);
  const ref = useClickOutside(() => setCalandarVisible(false));
  const inputRef = useRef(null);

  const { data: avilableDays, isLoading: isAvilableDaysLoading } = useQuery(
    ["booking-days-availability", date.getMonth(), date.getFullYear()],
    () =>
      getBookingDays({ month: date.getMonth() + 1, year: date.getFullYear() })
  );

  function dayAvailability(selectedDate, dataArray) {
    let res = dataArray.map((item) => {
      if (new Date(item.date) <= new Date(selectedDate)) {
        return false;
      }
      return item;
    });
    const checkInIndex = res.findIndex((item) => item.isCheckIn === true);

    res = res.map((item, index) => {
      if (item === true) return true;
      if (item === false) return false;
      if (checkInIndex === -1) return true;
      if (index <= checkInIndex) {
        return true;
      }
      return false;
    });
    return res;
  }

  useEffect(() => {
    if (checkInDate && !isAvilableDaysLoading && avilableDays) {
      const data = dayAvailability(checkInDate, avilableDays);
      setAllowedDays(data);
    }
  }, [checkInDate, date, isAvilableDaysLoading]);

  const daysInMonth = (month, year) =>
    new IndianDate(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) =>
    new IndianDate(year, month, 1).getDay();

  const generateEmptyCells = (count) =>
    Array.from({ length: count }, (_, index) => (
      <div key={`empty-${index}`} className="empty-cell select-none" />
    ));

  const handleDateSelect = (isBooked, isCheckIn, isPastDay, dayNum, index) => {
    if (isBooked) {
      if (isCheckOutForm && isCheckIn) {
        handleDateClick(dayNum);
        return;
      }
      toast.error("Already booked");
      return;
    }
    if (isPastDay) {
      toast.error("Can't book for past dates");
      return;
    }
    if (dayNum) {
      if (isCheckOutForm && allowedDays?.[index]) {
        handleDateClick(dayNum);
        return;
      }
      if (!isCheckOutForm) {
        handleDateClick(dayNum);
      }
    }
  };
  function areDatesEqual(d1, d2) {
    const date1 = new IndianDate(d1);
    const date2 = new IndianDate(d2);

    const day1 = date1.getDate();
    const month1 = date1.getMonth();
    const year1 = date1.getFullYear();

    const day2 = date2.getDate();
    const month2 = date2.getMonth();
    const year2 = date2.getFullYear();

    return day1 === day2 && month1 === month2 && year1 === year2;
  }
  const liClass = (
    isLoading,
    isBooked,
    isCheckIn,
    isPastDate,
    isSelected,
    index,
  ) => {
    if (!isLoading && isBooked) {
      if (isCheckOutForm && isCheckIn && allowedDays?.[index] && checkInDate) {
        if (isSelected) {
          return "bg-blue-500 text-white cursor-pointer";
        }
        return "bg-[#00000010] text-slate-800 cursor-pointer";
      }
      return "bg-red-400 text-white cursor-not-allowed";
    } else if (isPastDate) {
      return "bg-orange-400 text-white cursor-not-allowed";
    } else if (isSelected) {
      return "bg-blue-500 text-white";
    } else if (isCheckOutForm && !allowedDays?.[index] && checkInDate) {
      return "bg-red-400 text-white cursor-not-allowed";
    } else {
      return "bg-[#00000010] text-slate-800 cursor-pointer";
    }
  };

  const generateDayCells = (count) =>
    Array.from({ length: count }, (_, index) => (
      <li
        key={index + 1}
        className={`${classes["calendar-day"]
          } calendar-day select-none  ${liClass(
            isAvilableDaysLoading,
            avilableDays?.[index]?.isBooked,
            avilableDays?.[index]?.isCheckIn,
            isPastDay(avilableDays?.[index]?.date),
            areDatesEqual(avilableDays?.[index]?.date, value),
            index,
          )}`}
        onClick={() =>
          handleDateSelect(
            avilableDays?.[index]?.isBooked,
            avilableDays?.[index]?.isCheckIn,
            isPastDay(avilableDays?.[index]?.date),
            index + 1,
            index,
          )
        }
      >
        {index + 1}
      </li>
    ));

  function isPastDay(dateString) {
    const inputDate = new IndianDate(dateString);
    const today = new IndianDate();

    // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  }

  const handleDateClick = (day) => {
    const clickedDate = new IndianDate(
      date.getFullYear(),
      date.getMonth(),
      day
    );
    setData(clickedDate);

    if (type === "check-in-date" && !dateToValidate) {
      setCalandarVisible(false);
    }
    if (type === "check-in-date" && dateToValidate > clickedDate) {
      setCalandarVisible(false);
    }
    if (type === "check-out-date" && dateToValidate < clickedDate) {
      setCalandarVisible(false);
    }
  };

  const generateCalendar = () => {
    const daysCount = daysInMonth(date.getMonth(), date.getFullYear());
    const firstDay = getFirstDayOfMonth(date.getMonth(), date.getFullYear());

    const emptyCells = generateEmptyCells(firstDay);
    const dayCells = generateDayCells(daysCount);

    return [...emptyCells, ...dayCells];
  };

  const nextMonth = () => {
    setDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  };

  function formatToDDMMYYYY(inputDate) {
    if (inputDate) {
      const date = new IndianDate(inputDate);
      const formattedDate = date.toLocaleDateString("en-GB"); // 'dd/mm/yyyy'
      return formattedDate;
    }
  }

  useEffect(() => {
    if (!calandarVisible) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [calandarVisible]);

  return (
    <span ref={ref}>
      <label htmlFor={label}>{label}</label>
      <div className="relative max-w-sm">
        <input
          eadonly="readonly"
          inputmode="none"
          id={label}
          datepicker-orientation="bottom right"
          type="text"
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pe-10 p-2.5`}
          placeholder="dd / mm / yyyy"
          onFocus={() => setCalandarVisible(true)}
          // onBlur={checkInFocusToggle}
          value={formatToDDMMYYYY(value)}
          ref={inputRef}
          autoComplete="off"
        />
        <div
          className={`absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none`}
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
            className="lucide lucide-calendar w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        {calandarVisible && (
          <div
            className={`${classes.calendar} absolute bg-white w-[300px] rounded-md z-30 top-16 p-5`}
          >
            {isAvilableDaysLoading && (
              <div className="bg-slate-600/20 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-loader-2 rotate w-10 h-10 text-slate-700"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            )}
            <div
              className={`${classes.calendarHeader} flex items-center justify-between border-gray-200 border-b-2 pb-4`}
            >
              <button onClick={prevMonth}>
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
                  className="lucide lucide-chevron-left-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m14 16-4-4 4-4" />
                </svg>
              </button>
              <h6 className="font-semibold select-none">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  year: "numeric",
                })?.format(date)}
              </h6>
              <button onClick={nextMonth}>
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
                  className="lucide lucide-arrow-right-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="m12 16 4-4-4-4" />
                </svg>
              </button>
            </div>
            <ul className={`${classes.calendarWeeks}`}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((week) => (
                <li
                  className="font-semibold text-slate-900 select-none"
                  key={week}
                >
                  {week}
                </li>
              ))}
              {generateCalendar()}
            </ul>
          </div>
        )}
      </div>
    </span>
  );
}
