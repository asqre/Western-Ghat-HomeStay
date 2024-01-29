import Hero from "@/components/Hero/Hero";
import MainLayout from "@/layouts/Main";
import React, { useState } from "react";
import classes from "./style.module.css";
import Image from "next/image";
import { useQuery } from "react-query";
import { getImages } from "@/apiClient/image";
import Viewer from "@/components/Viewer";

export default function GalleryPage() {
  const { data: galleryImages } = useQuery("gallery-images", () =>
    getImages("gallery")
  );

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
      <Hero title="Gallery" />
      <div className={classes.galleryWrapper}>
        {galleryImages?.map((img, index) => (
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
    </MainLayout>
  );
}
