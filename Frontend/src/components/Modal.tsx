import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import download from "../assets/download.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCropData: (data: string) => void;
  setError: (error: string | null) => void;
  handleUpload: (images: File[]) => void;
  uploadProgress: number;
  error: string | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  setCropData,
  setError,
  handleUpload,
  uploadProgress,
  error,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + images.length > 5) {
        setError("You've reached the image limit.");
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
    [images, setError]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  const handleConfirmUpload = () => {
    handleUpload(images);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-[#0A0A0A] bg-opacity-80 flex items-center justify-center z-50 xs:p-4  ">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[576px] h-[680px]">
        <p>Upload image(s)</p>
        <p>You may upload up to 5 images</p>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl "
          onClick={onClose}
        >
          &times;
        </button>

        <div
          {...getRootProps()}
          className="dropzone p-6 border-2 bg-[#FAFAFA] border-gray-300 rounded-md text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="flex  flex-col items-center justify-center bg-[#FAFAFA]">
            <img src={download} alt="download" className="" />
            <p className="text-gray-600">Click or drag and drop to upload</p>
            <p>PNG, or JPG (Max 5MB)</p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="image-preview flex-wrap mt-2 flex flex-col">
            {images.map((image, index) => (
              <div key={index} className="image-thumbnail relative ">
                <img
                  src={URL.createObjectURL(image)}
                  alt="thumbnail"
                  className="w-20 h-20 object-cover cursor-pointer"
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
          <div className="image-cropper">
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
          <progress className="w-full mt-4" value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleConfirmUpload}
        >
          Confirm
        </button>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal;
