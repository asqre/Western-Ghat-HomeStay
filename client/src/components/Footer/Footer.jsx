import React, { useState } from "react";
import Image from "next/image";
import classes from "./Footer.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import SocialMedia from "./social-media";

export default function Footer({ social_media = {} }) {
  const router = useRouter();
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact us", path: "/#contact-us" },
    { label: "Terms & Conditions", path: "/terms-and-condition" },
    { label: "Privacy Policy", path: "/privacy-and-policy" },
  ];
  return (
    <>
      <div className={`${classes.footer}`}>
        <div
          className={`${classes.footerContainer} container m-auto flex justify-center`}
        >
          <div className={`${classes.footerItem1}`}>
            <Image src="/logo-lg.png" width={279} height={93} alt="" />
            <p>
              Summarize your business so the visitor can learn about your
              offerings from any page on your website.
            </p>
            <div className={classes.footer_social_media_group}>
              <div className={classes.footer_social_media_item}>
                <SocialMedia {...social_media} />
              </div>
            </div>
          </div>
          <div className={`${classes.footerItem2}`}>
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((item) => (
                <li
                  key={item.path}
                  className={`${
                    item.path === router.asPath ? "text-[#F27501]" : ""
                  }`}
                >
                  <Link href={item.path} className="block w-max">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${classes.footerItem3}`}>
            <h4>Quick Links</h4>
            <div className={classes.footerItem3_info}>
              <div className={classes.footerItem3_info_item}>
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
                        fill="#F27501"
                      />
                      <path
                        d="M16 15.3334C17.8409 15.3334 19.3333 13.841 19.3333 12.0001C19.3333 10.1591 17.8409 8.66675 16 8.66675C14.159 8.66675 12.6667 10.1591 12.6667 12.0001C12.6667 13.841 14.159 15.3334 16 15.3334Z"
                        fill="#F27501"
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
              <div className={classes.footerItem3_info_item}>
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
                        fill="#F27501"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_260_1734">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <a href="tel:918618338785">+91 8618338785</a>
              </div>
              <div className={classes.footerItem3_info_item}>
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
                        fill="#F27501"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_260_1737">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <a href="mailto:wghomestay@gmail.com">wghomestay@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${classes.copyright} text-white text-center`}>
        &#169; All Rights Reserved.
      </div>
    </>
  );
}
