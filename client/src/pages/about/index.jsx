import React, { useState } from "react";
import classes from "./style.module.css";
import MainLayout from "@/layouts/Main";
import Hero from "@/components/Hero/Hero";
import about from "../../assets/about-lg.png";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";
import { getImages } from "@/apiClient/image";

import f1 from "../../assets/features/1.svg";
import f2 from "../../assets/features/2.svg";
import f3 from "../../assets/features/3.svg";
import f4 from "../../assets/features/4.svg";
import f5 from "../../assets/features/5.svg";
import f6 from "../../assets/features/6.svg";
import Viewer from "@/components/Viewer";

export default function About() {
  const { data: galleryImages } = useQuery("gallery-images", () =>
    getImages("gallery")
  );
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

  const initialPrevState = {
    isOpen: false,
    images: [],
    currImg: 0,
  };
  const [prevState, setPrevState] = useState(initialPrevState);

  const openViewer = (images, currImg = 0) => {
    setPrevState({ ...prevState, isOpen: true, images, currImg });
  };
  const closeViewer = () => {
    setPrevState({ ...prevState, isOpen: false, images: [] });
  };

  return (
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
      <Hero title="About" />
      <section
        id="about"
        className={`${classes.about} container m-auto md:mb-[120px]`}
      >
        <div className={`${classes.about_left} md:w-2/5 px-4 md:px-0`}>
          <h3>Welcome to Western Ghat HomeStay!!</h3>
          <p>
            Escape the bustling city life and immerse yourself in the
            tranquility of nature’s embrace at WesternGardenHomeStay, your
            gateway to serenity and adventure. Our idyllic homestay, nestled
            amidst the picturesque landscapes of Karnataka, offers a unique
            blend of comfort, exploration, and cultural immersion.
          </p>
          <p>
            Whether you’re seeking the soothing sounds of the waves crashing on
            pristine beaches, the exhilarating thrill of trekking through lush
            forests, or the captivating charm of ancient palaces,
            WesternGardenHomeStay provides the perfect base for your Karnatakan
            escapade.
          </p>
          <p>
            Located conveniently near beaches, waterfalls, and historical
            landmarks, our homestay allows you to discover the hidden gems of
            this enchanting state. Experience the vibrant local culture, savor
            authentic flavors, and witness the rich traditions that define
            Karnataka’s unique identity.At WesternGardenHomeStay, we believe in
            creating unforgettable experiences that go beyond mere
            accommodations. We invite you to embrace the serenity of nature, the
            warmth of rural life, and the endless possibilities that await in
            this captivating coastal haven.
          </p>
        </div>
        <Image
          className={classes.about_right_img}
          src={about}
          width={671}
          height={720}
          alt=""
        />
      </section>
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
      <section className={`${classes.gallery} container m-auto`}>
        <h2>Gallery</h2>
        <div className={classes.galleryWrapper}>
          {galleryImages?.slice(0, 8)?.map((img, index) => (
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
    </MainLayout>
  );
}
