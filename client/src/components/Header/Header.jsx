import React, { useState } from "react";
import classes from "./Header.module.css";
import Image from "next/image";
import logoLg from "../../assets/logo-lg.png";
import locationIcon from "../../assets/location.svg";
import phoneIcon from "../../assets/phone.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

export default function Header() {
  const router = useRouter();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Gallery", path: "/gallery" },
    // { label: "Contact us", path: "/#contact-us" },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className={`${classes.header} shadow-md`}>
      <div className={classes.top_section}>
        <div className="container m-auto">
          <div className="container m-auto flex justify-between flex-col md:flex-row items-start md:items-center p-2 md:p-0 gap-1 md:gap-0">
            <div className="flex gap-3">
              <Image src={locationIcon} alt="" />
              <span>
                Post Betkuli Near railway bridge Betkuli Gokarna - 581333
              </span>
            </div>
            <div className="flex gap-3">
              <Image src={phoneIcon} alt="" />
              <a href="tel:8618338785">8618338785</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container m-auto">
        <div className={classes.bottom_section}>
          <Link href="/" className={classes.bottom_section_left}>
            <Image
              src={logoLg}
              width={175}
              height={58.77}
              alt="Western Ghat, Home stay logo"
              className="py-1"
            />
          </Link>
          {open ? (
            <svg
              onClick={() => setOpen(false)}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              onClick={() => setOpen(true)}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
          <div
            className={`${classes.bottom_section_right} ${
              open ? "bottom-[-175px]" : "bottom-[160px]"
            }`}
          >
            <ul className="flex gap-8 h-full">
              {navLinks.map((item) => (
                <li
                  key={item.path}
                  className={`uppercase font-semibold h-full flex items-center justify-center px-2 border-b-4 ${
                    item.path === router.asPath
                      ? "border-orange-500"
                      : "border-white"
                  }`}
                >
                  <Link href={item.path}>{item.label}</Link>
                </li>
              ))}
              {router.asPath === "/" ? (
                <li
                  key="/#contact-us"
                  className={`uppercase font-semibold h-full flex items-center justify-center px-2 border-b-4 ${
                    "/#contact-us" === router.asPath
                      ? "border-orange-500"
                      : "border-white"
                  }`}
                >
                  <ScrollLink to="contact-us" smooth={true} duration={500}>
                    Contact
                  </ScrollLink>
                </li>
              ) : (
                <li
                  key="/#contact-us"
                  className={`uppercase font-semibold h-full flex items-center justify-center px-2 border-b-4 ${
                    "/#contact-us" === router.asPath
                      ? "border-orange-500"
                      : "border-white"
                  }`}
                >
                  <Link href="/#contact-us">Contact</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
