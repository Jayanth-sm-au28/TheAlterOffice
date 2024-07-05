// import React from 'react'
import cover from "../assets/cover.png";
import emoji from "../assets/emoji.svg";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Avatar from "react-avatar";
import Cropper from "react-cropper";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import "cropperjs/dist/cropper.css";
import Modal from "./Modal";

const ImageUploader = () => {
  const [avatarSize, setAvatarSize] = useState("160px");
  const [images, setImages] = useState<File[]>([]);
  const [cropData, setCropData] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const updateAvatarSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 320 && screenWidth <= 672) {
      setAvatarSize("96px");
    } else {
      setAvatarSize("160px");
    }
  };

  useEffect(() => {
    updateAvatarSize();
    window.addEventListener("resize", updateAvatarSize);
    return () => window.removeEventListener("resize", updateAvatarSize);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + images.length > 5) {
        setError("You can only upload up to 5 images.");
        return;
      }
      const validFiles = acceptedFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          setError(
            `The file format of ${file.name} is not supported. Please upload an image in one of the following formats: JPG, PNG.`
          );
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(
            "This image is larger than 5MB. Please select a smaller image."
          );
          return false;
        }
        return true;
      });
      setImages((prevImages) => [...prevImages, ...validFiles]);
      setError(null);
    },
    [images]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setUploadProgress(100);
      console.log("Upload success", response.data);
      // Handle success response
    } catch (error) {
      setError(
        "An error occurred during the upload. Please check your network connection and try again."
      );
      setUploadProgress(0);
    }
  };

  const handleImageSelection = (image: File) => {
    setSelectedImage(URL.createObjectURL(image));
  };

  const handleCrop = () => {
    if (selectedImage) {
      const cropper = (document.querySelector(".cropper") as any).cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      setCropData(croppedCanvas.toDataURL());
    }
  };
  return (
    <div className=" md:p-10 xs:px-7">
      <div className="max-w-[768px]  rounded-md md:max-w-screen-[672px]">
        <div className="rounded-md shadow-md">
          <img
            src={cover}
            alt="Banner"
            className="rounded-t-md xs:h-32 h-44 w-full"
          />
          <div className="absolute transform -translate-y-1/2 md:ml-8 xs:ml-4 border-4  rounded-full">
            <Avatar
              src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg"
              size={avatarSize}
              // height="120px"
              className="sm:h-24 sm:w-24"
              round={true}
            />
          </div>
          <div className="text-right mt-4 mr-4">
            <button
              className=" xs:px-3.5 xs:py-2 md:py-3 hover:bg-gray-200 rounded-md md:px-5 border border-[#E5E5E5] md:text-base xs:text-sm font-medium text-[#171717]"
              onClick={() => setIsModalOpen(true)}
            >
              Update picture
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div
              {...getRootProps()}
              className="dropzone p-6 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
            {images.length > 0 && (
              <div className="image-preview flex flex-wrap mt-4">
                {images.map((image, index) => (
                  <div key={index} className="image-thumbnail relative m-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="thumbnail"
                      className="w-24 h-24 object-cover cursor-pointer"
                      onClick={() => handleImageSelection(image)}
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedImage && (
              <div className="image-cropper mt-4">
                <Cropper
                  src={selectedImage}
                  className="cropper h-80 w-full"
                  aspectRatio={1}
                  guides={false}
                  crop={handleCrop}
                />
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleCrop}
                >
                  Crop
                </button>
              </div>
            )}
            {uploadProgress > 0 && (
              <progress
                className="w-full mt-4"
                value={uploadProgress}
                max="100"
              >
                {uploadProgress}%
              </progress>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleUpload}
            >
              Confirm
            </button>
          </Modal>
          <div className="px-4 pb-[70px]">
            <h1 className="font-bold text-xl text-start py-6">Jack Smith</h1>
            <div className="flex items-start xs:flex-col md:flex-row justify-start text-xl font-normal text-neutral-900">
              <p className="text-xl font-normal">@kingjack</p>
              <p className="flex items-center xs:mt-3 md:mt-0 text-xl font-normal">
                <div className="mx-3 h-1.5 w-1 rounded-full  bg-neutral-400 xs:hidden md:block"></div>
                Senior Product Designer
              </p>
              <p className="flex items-center xs:mt-3 md:mt-0 text-xl font-normal">
                <span className="text-neutral-600">at</span>
                <img src={emoji} alt="emoji" className="mx-2" />
                Webflow{" "}
                <p className="text-neutral-600 flex items-center text-xl font-normal">
                  <div className="mx-3 h-1.5 w-1 rounded-full bg-neutral-400 "></div>
                  He/Him
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
