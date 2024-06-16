"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";

interface VideoUploadProps {
  onChange: (file: File | null) => void;
  value: string | ArrayBuffer | null | File;
  circle?: boolean;
  cover?: boolean;
  fill?: boolean;
  classname?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onChange,
  value,
  circle,
  cover,
  fill,
  classname,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const [preview, setPreview] = useState(value);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

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
        accept=".mov,.mp4"
        hidden
        id="videoUpload"
      />
      <div
        className={`${classname} relative cursor-pointer transition p-20 flex flex-col justify-center items-center gap-4 text-neutral-600 ${
          circle ? "rounded-full aspect-square w-full h-full" : "w-full h-full"
        } ${cover && "object-cover"} ${fill && "object-fill aspect-video"}`}
      >
        <label
          htmlFor="videoUpload"
          className="font-semibold text-lg cursor-pointer"
        >
          {t("components.click-to-upload-video")}
        </label>
        {preview && (
          <>
            <div className="absolute inset-0 w-full h-full">
              <video
                className="h-full w-full"
                controls
                src={preview as string | any}
              />
            </div>
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full cursor-pointer hover:opacity-70"
            >
              {t("components.delete")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
