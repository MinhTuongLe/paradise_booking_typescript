"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import { MdCancel } from "react-icons/md";

interface ImageUploadProps {
  onChange: (files: File[] | null) => void;
  values: Array<string | ArrayBuffer | null | File>;
  circle?: boolean;
  cover?: boolean;
  fill?: boolean;
  classname?: string;
}

const MultiImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  values,
  circle,
  cover,
  fill,
  classname,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const [previews, setPreviews] =
    useState<Array<string | ArrayBuffer | null | File>>(values);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files;

    if (file) {
      const fileArray = Array.from(file);
      const previewsArray = await Promise.all(
        fileArray.map((file) => {
          return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
      setPreviews((prevPreviews) => [...prevPreviews, ...previewsArray]);
      onChange([...files, ...fileArray]);
    }
  };

  const handleDeleteClick = (index: number) => {
    const newPreviews = previews.slice();
    const newFiles = files.slice();
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setPreviews(newPreviews);
    setFiles(newFiles);
    onChange(newFiles.length ? newFiles : null);
  };

  useEffect(() => {
    const generatePreviews = async (files: File[]) => {
      const previewsArray = await Promise.all(
        files.map((file) => {
          return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      setPreviews(previewsArray);
    };

    if (values && values.length > 0) {
      generatePreviews(
        values.filter((value) => value instanceof File) as File[]
      );
    }
  }, [values]);

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        hidden
        multiple
        id="multiImageUpload"
      />
      <div
        className={`relative cursor-pointer transition p-20 pb-0 flex flex-col justify-start items-start gap-4 text-neutral-600 ${classname}`}
      >
        <div className="w-full text-center">
          <label
            htmlFor="multiImageUpload"
            className="font-semibold text-lg cursor-pointer"
          >
            {t("components.click-to-upload-images")}
          </label>
        </div>
        <div className="flex flex-wrap gap-4 mt-12">
          {previews.map((preview, index) => (
            <div
              key={index}
              className={`relative ${
                circle ? "rounded-[8px] aspect-square w-32 h-32" : "w-32 h-32"
              } ${cover && "object-cover"} ${
                fill && "object-fill aspect-video"
              }`}
            >
              <Image
                alt={`upload-${index}`}
                fill
                style={{
                  objectFit:
                    circle || cover ? "cover" : fill ? "fill" : "contain",
                  borderRadius: circle ? "100%" : "8px",
                }}
                src={preview as string | any}
              />

              <MdCancel
                size={28}
                onClick={() => handleDeleteClick(index)}
                className="absolute top-1 right-1 text-rose-500 border-[1px] border-white rounded-full cursor-pointer hover:opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiImageUpload;
