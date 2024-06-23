"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import { MdCancel } from "react-icons/md";

interface ImageUploadProps {
  onChange: (files: File[] | null, existed: string[] | null) => void;
  values: Array<string | ArrayBuffer | null | File>;
  circle?: boolean;
  cover?: boolean;
  fill?: boolean;
  classname?: string;
  existedImages: string[];
}

const MultiImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  values,
  circle,
  cover,
  fill,
  classname,
  existedImages,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const [previews, setPreviews] = useState<
    Array<string | ArrayBuffer | null | File>
  >([...values, ...existedImages]);
  const [files, setFiles] = useState<File[]>((values as File[]) || []);
  const [imageUrls, setImageUrls] = useState<string[]>(existedImages);

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
      onChange([...files, ...fileArray], imageUrls.length ? imageUrls : null);
    }
  };

  const handleDeleteClick = (index: number) => {
    const newPreviews = previews.slice();
    const newFiles = files.slice();
    const existed = imageUrls.slice();

    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    if (existed && index < existed?.length) {
      existed.splice(Math.max(index), 1);
      setImageUrls(existed);
    } else {
      newFiles.splice(Math.max(index - (existed?.length ?? 0), 0), 1);
      setFiles(newFiles);
    }
    onChange(
      newFiles?.length ? newFiles : null,
      existed?.length ? existed : null
    );
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
      setPreviews([...existedImages, ...previewsArray]);
    };

    if (values && values.length > 0) {
      generatePreviews(
        values.filter((value) => value instanceof File) as File[]
      );
    }
  }, [values, existedImages]);

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
        className={`relative cursor-pointer transition py-20 px-10 pb-0 flex flex-col justify-start items-start gap-4 text-neutral-600 ${classname}`}
      >
        <div className="w-full text-center">
          <label
            htmlFor="multiImageUpload"
            className="font-semibold text-lg cursor-pointer"
          >
            {t("components.click-to-upload-images")}
            <div className="text-md font-light">
              {t("components.recommend-images")}
            </div>
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
