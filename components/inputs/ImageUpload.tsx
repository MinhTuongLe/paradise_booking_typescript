"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  onChange: any,
  value: string | ArrayBuffer | null,
  circle: boolean,
  cover: boolean,
  fill: boolean,
  classname: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, circle, cover, fill, classname }) => {
  const [preview, setPreview] = useState(value);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        hidden
        id="imageUpload"
      />
      <div
        className={`${classname} relative cursor-pointer transition p-20 flex flex-col justify-center items-center gap-4 text-neutral-600 ${circle ? "rounded-full aspect-square w-full h-full" : "w-full h-full"
          } ${cover && "object-cover"} ${fill && "object-fill aspect-video"}`}
      >
        <label
          htmlFor="imageUpload"
          className="font-semibold text-lg cursor-pointer"
        >
          Click to upload
        </label>
        {preview && (
          <>
            <div className="absolute inset-0 w-full h-full">
              <Image
                alt="upload"
                fill
                style={{
                  objectFit:
                    circle || cover ? "cover" : fill ? "fill" : "contain",
                  borderRadius: circle ? "100%" : "",
                }}
                src={preview}
              />
            </div>
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:opacity-70"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
