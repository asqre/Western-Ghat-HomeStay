import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  IconButton,
  Input,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/solid";

import {
  addImage,
  deleteImage,
  getImages,
  uploadImageToCloudinary,
} from "@/apiClient/images";
import { toast } from "sonner";

export function Images() {
  const [activeTab, setActiveTab] = useState("banner");
  const [videoId, setVideoId] = useState("");
  const data = [
    {
      label: "Banner",
      value: "banner",
    },
    {
      label: "Gallery",
      value: "gallery",
    },
    {
      label: "Showcase",
      value: "showcase",
    },
  ];

  const uploadVideoHandler = async (e) => {
    e.preventDefault();
    if (!videoId) {
      toast.error("Provide valid video id");
      return;
    }
    postYoutubeVideo();
  };

  const postYoutubeVideo = async () => {
    const addImageResponse = await addImage(undefined, "gallery", videoId);
    if (addImageResponse) {
      setVideoId("");
      toast.success("Video Added successfully");
    } else {
      toast.error("Failed, please try again.");
    }
  };

  return (
    <div>
      <Card
        color="transparent"
        shadow={false}
        className="w-full mt-12 p-10 shadow-md"
      >
        <Typography variant="h4" color="blue-gray" className="mb-5">
          Images
        </Typography>
        <Tabs value={activeTab}>
          <TabsHeader defaultChecked={activeTab}>
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value }) => (
              <TabPanel key={value} value={value} className="pt-10">
                <ImagesSection image_type={activeTab} />
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </Card>
      <Card
        color="transparent"
        shadow={false}
        className="w-full mt-12 p-10 shadow-md"
      >
        <Typography variant="h4" color="blue-gray" className="mb-5">
          Videos
        </Typography>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={uploadVideoHandler}>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Video Id
            </Typography>
            <Input
              size="lg"
              placeholder="Ex. 2boFWZ6c3jo"
              type="text"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={videoId}
              onChange={({ target }) => setVideoId(target.value)}
            />
            <Button type="submit">Upload</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

function ImagesSection({ image_type }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, [image_type]);

  const fetchImages = async () => {
    const images = await getImages(image_type);
    setImages(images);
  };

  const handleImageChange = async (e) => {
    try {
      const image = e.target.files[0];
      if (!image) return toast.error("Failed to select");

      const promise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const image_url = await uploadImageToCloudinary(image);
            const addImageResponse = await addImage(image_url, image_type);
            await setImages([...images, addImageResponse]);
            resolve(addImageResponse);
          } catch (error) {
            reject(error);
          }
        });
      toast.promise(promise, {
        loading: "Loading...",
        success: "Image Uploaded successfully",
        error: "Failed to  upload",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImageHandler = async (id) => {
    try {
      const imageDeleted = await deleteImage(id);

      if (imageDeleted.success) {
        setImages(images.filter((img) => img._id !== id));
        return toast.success(imageDeleted.message);
      }
      toast.error(imageDeleted.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex gap-8 flex-wrap justify-start">
      <Card className="mt-6 w-64 h-64 p-4">
        <label
          htmlFor="image-dnd"
          className="w-full h-full flex items-center justify-center cursor-pointer rounded-md border-2 border-gray-300 border-dashed group"
        >
          <CloudArrowUpIcon
            className="w-16 h-16 group-hover:w-14 group-hover:h-14 transition-all"
            color="blue-gray"
          />
        </label>
        <input
          type="file"
          id="image-dnd"
          accept=".png, .jpg, .webp, .jpeg"
          multiple="false"
          className="hidden"
          onChange={handleImageChange}
        />
      </Card>
      {images?.map((image) => (
        <Card className="mt-6 w-64 h-64 p-4 relative group">
          <img
            src={
              image.image_url
                ? image.image_url
                : `https://img.youtube.com/vi/${image?.video_id}/0.jpg`
            }
            alt="card-image"
            className="w-full h-full object-cover rounded-md"
          />

          <div className="absolute right-4 bottom-4">
            <IconButton
              className="hidden group-hover:block transition-all"
              onClick={() => deleteImageHandler(image._id)}
            >
              <TrashIcon className="text-lg text-white w-6" />
            </IconButton>
          </div>
        </Card>
      ))}
    </div>
  );
}
