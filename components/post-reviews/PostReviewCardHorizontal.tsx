"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Button from "../Button.tsx";
import { emptyImage } from "../../const.ts";
import {
  getTopicDescription,
  getTopicImage,
  getTopicName,
} from "@/utils/getTopic.ts";
import { Topic } from "@/enum.ts";

interface PostReviewCardHorizontalProps {
  value: Topic;
}

const PostReviewCardHorizontal: React.FC<PostReviewCardHorizontalProps> = ({
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
      onClick={() => router.push(`post-reviews/collections/${value}`)}
    >
      <div className="flex flex-col gap-2 w-full relative">
        <div className="aspect-video w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-video h-full w-full group-hover:scale-110 transition rounded-xl"
            src={getTopicImage(value) || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="absolute top-4 left-4 max-w-[60%] overflow-hidden">
          <div className="font-light text-white line-clamp-2 break-words">
            {t(`type-selections.${getTopicName(value)}`)}
          </div>
          <div className="text-white line-clamp-2 break-words text-2xl font-bold">
            {t(`type-selections.${getTopicDescription(value)}`)}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button
            outline
            label={t("components.show-all")}
            onClick={() => router.push(`post-reviews/collections/${value}`)}
            classnames="px-4 py-[4px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PostReviewCardHorizontal;
