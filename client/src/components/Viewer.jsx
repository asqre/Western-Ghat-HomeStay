import Image from "next/image";
import React, { useEffect, useState } from "react";
import AdvImage from "./AdvImage";
import YouTube from "react-youtube";

export default function Viewer({ images = [], onClose, imgIndex = 0 }) {
  const [index, setIndex] = useState(imgIndex);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = () => {
    if ((images.length > 0 ? images.length - 1 : images.length) > index) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };
  const handlePrev = () => {
    if (index === 0) {
      setIndex(images.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-[500]">
      <div
        className="w-full h-full bg-slate-800/90 absolute top-0 left-0 z-[501]"
        onClick={onClose}
      />

      <button
        className="text-white w-16 md:w-[70px] bg-slate-500/60 rounded-full cursor-pointer absolute top-8 right-8 z-[502]"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <div className="w-full h-full absolute top-0 left-0">
        <div className="w-full h-full flex justify-between items-center px-1 md:px-12">
          <div
            className="text-white w-8 md:w-[70px] bg-slate-500/60 rounded-full cursor-pointer z-[502]"
            onClick={handlePrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <div
            className="text-white w-8 md:w-[70px] bg-slate-500/60 rounded-full cursor-pointer z-[502]"
            onClick={handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center z-[502] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        {!images[index]?.video_id ? (
          <AdvImage
            classN="max-h-screen object-contain w-[350px] md:w-[900px] max-w-screen-md"
            url={images[index].url}
          />
        ) : (
          <YouTube
            videoId={images[index]?.video_id ?? "2boFWZ6c3jo"}
            className="w-[350px] h-[200px] lg:w-[700px] lg:h-[500px] xl:w-[1000px] xl:h-[600px]"
            iframeClassName="w-full h-full bg-red-700"
          />
        )}
      </div>
    </div>
  );
}
