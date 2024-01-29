import NextImage from "next/image";
// import Image from "next/image";
import { useState, useEffect } from "react";
import loadingGif from "@/assets/loading.gif";

const AdvImage = ({ url, classN = "" }) => {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = new Image();
      img.src = url;

      img.onload = () => {
        setImageLoaded(true);
        setLoading(false);
      };

      img.onerror = () => {
        setLoading(false);
      };

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [url]);

  return (
    <div>
      {loading && <LoadingGif />}{" "}
      {imageLoaded && (
        <NextImage
          width={1000}
          height={1000}
          src={url}
          alt=""
          className={classN}
        />
      )}
    </div>
  );
};

const LoadingGif = () => <NextImage src={loadingGif} />;

export default AdvImage;
