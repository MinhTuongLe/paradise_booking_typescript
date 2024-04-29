"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Button from "../Button.tsx";
import { emptyImage } from "../../const.ts";
import { PostGuiderType } from "@/enum.ts";
import {
  getPostGuiderTypeDescription,
  getPostGuiderTypeImage,
  getPostGuiderTypeName,
} from "@/utils/getPostGuiderType.ts";

interface PostGuiderCardHorizontalProps {
  value: PostGuiderType;
}

const PostGuiderCardHorizontal: React.FC<PostGuiderCardHorizontalProps> = ({
  value,
}) => {
  const router = useRouter();
  const { t } = useTranslation("translation", { i18n });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="col-span-1 cursor-pointer group"
      onClick={() => router.push(`post-guiders/collections/${value}`)}
    >
      <div className="flex flex-col gap-2 w-full relative">
        <div className="aspect-video w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-video h-full w-full group-hover:scale-110 transition rounded-xl"
            src={getPostGuiderTypeImage(value) || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="absolute top-4 left-4 max-w-[50%] overflow-hidden">
          <div className="font-light text-white line-clamp-2 break-words">
            {t(`post-guider-types.${getPostGuiderTypeName(value)}`)}
          </div>
          <div className="text-white line-clamp-2 break-words text-2xl font-bold">
            {t(`post-guider-types.${getPostGuiderTypeDescription(value)}`)}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button
            outline
            label="Show all"
            onClick={() => router.push(`post-guiders/collections/${value}`)}
            classnames="px-4 py-[4px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PostGuiderCardHorizontal;
