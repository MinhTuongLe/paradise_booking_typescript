"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: string | ArrayBuffer | null;
  circle?: boolean;
  cover?: boolean;
  fill?: boolean;
  classname?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
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

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(value);
    } else {
      setPreview(value);
    }
  }, [value]);

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
        className={`${classname} relative cursor-pointer transition p-20 flex flex-col justify-center items-center gap-4 text-neutral-600 ${
          circle ? "rounded-full aspect-square w-full h-full" : "w-full h-full"
        } ${cover && "object-cover"} ${fill && "object-fill aspect-video"}`}
      >
        <label
          htmlFor="imageUpload"
          className="font-semibold text-md cursor-pointer text-center"
        >
          {t("components.click-to-upload-image")}
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

export default ImageUpload;
