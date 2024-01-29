import MainLayout from "@/layouts/Main";
import React, { useEffect } from "react";
import classes from "./style.module.css";
import Link from "next/link";
import Image from "next/image";
import successBg from "../../assets/success-bg.png";
import partySm from "../../assets/party-sm.png";
import { useRouter as Navigation } from "next/navigation";
import { useQuery } from "react-query";
import { viewBookingDetails } from "@/apiClient/booking";
import {
  CalendarIcon,
  CardIcon,
  RupeeIcon,
  UserIcons,
  UsersIcon,
} from "@/components/Success/Icons";
import { toast } from "sonner";
import LoadingFull from "@/components/LoadingFull";
import IndianDate from "@/utils/date";

export default function SuccessPage({ id }) {
  const navigation = Navigation();
  const { data, isLoading, isError } = useQuery(
    [`booking-details`, id],
    () => viewBookingDetails(id),
    {
      enabled: !!id,
    }
  );

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

  useEffect(() => {
    if (!isLoading && !data && isError) {
      toast.error("Invalid booking id");
      // navigation.push("/");
    }
  }, [id]);

  if (!data && isLoading) {
    return (
      <MainLayout>
        <LoadingFull />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container m-auto mt-[10px]">
        <Link href="/" className={classes.back}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_375_3724)">
              <path
                d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                fill="#8590A2"
              />
            </g>
            <defs>
              <clipPath id="clip0_375_3724">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>Go back to home</span>
        </Link>
        <div className={classes.card}>
          <Image src={successBg} alt="" />
          <div className={classes.message}>
            <Image src={partySm} width={60} height={60} alt="" />
            <div>
              <h3>Congratulations !!</h3>
              <p>Your booking is complete</p>
            </div>
            <Image src={partySm} width={60} height={60} alt="" />
          </div>
          <ul className={`${classes.info} md:mx-[24px]`}>
            <div>
              <li className={classes.infoItem} key="booked_by">
                <span className={classes.infoItemKey}>
                  <span>
                    <UserIcons />
                  </span>
                  <span>Booked By :</span>
                </span>
                <span className={classes.infoItemValue}>{data?.bookedBy}</span>
              </li>
              <li className={classes.infoItem} key="payment_method">
                <span className={classes.infoItemKey}>
                  <span>
                    <CardIcon />
                  </span>
                  <span>Payment Method :</span>
                </span>
                <span className={classes.infoItemValue}>
                  {data?.payment_method}
                </span>
              </li>
              <li className={classes.infoItem} key="total_price">
                <span className={classes.infoItemKey}>
                  <span>
                    <RupeeIcon />
                  </span>
                  <span>Total Price :</span>
                </span>
                <span className={classes.infoItemValue}>
                  {data?.total_rent + data?.total_tax}
                </span>
              </li>
            </div>
            <div>
              <li className={classes.infoItem} key="check_in">
                <span className={classes.infoItemKey}>
                  <span>
                    <CalendarIcon />
                  </span>
                  <span>Check In :</span>
                </span>
                <span className={classes.infoItemValue}>
                  {data?.checkIn ? formatDate(data?.checkIn) : "Loading..."}
                </span>
              </li>
              <li className={classes.infoItem} key="payment_method">
                <span className={classes.infoItemKey}>
                  <span>
                    <CalendarIcon />
                  </span>
                  <span>Check Out :</span>
                </span>
                <span className={classes.infoItemValue}>
                  {formatDate(data?.checkOut)}
                </span>
              </li>
              <li className={classes.infoItem} key="total_price">
                <span className={classes.infoItemKey}>
                  <span>
                    <UsersIcon />
                  </span>
                  <span>Total Guests :</span>
                </span>
                <span className={classes.infoItemValue}>
                  {data?.numberOfAdults + data?.numberOfKids}
                </span>
              </li>
            </div>
          </ul>
          <a
            className={classes.downloadBtn}
            href={`${process.env.API_BASE}/pdf/booking/${data?._id}`}
            target="_blank"
            download={`${data?._id}.pdf`}
          >
            <span>download invoice</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_375_3721)">
                <path
                  d="M12.6663 6H9.99967V2H5.99967V6H3.33301L7.99967 10.6667L12.6663 6ZM7.33301 7.33333V3.33333H8.66634V7.33333H9.44634L7.99967 8.78L6.55301 7.33333H7.33301ZM3.33301 12H12.6663V13.3333H3.33301V12Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_375_3721">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps = async (context) => {
  const { params } = context;
  const id = params.id;

  return {
    props: {
      id,
    },
  };
};
