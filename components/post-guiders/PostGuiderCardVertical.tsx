"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

import { emptyImage } from "../../const.ts";
import { PostGuider } from "@/models/post.ts";

interface PostGuiderCardVerticalProps {
  data: PostGuider;
}

const PostGuiderCardVertical: React.FC<PostGuiderCardVerticalProps> = ({
  data,
}) => {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      onClick={() => {
        if (pathName === "/post-guiders/mine") {
          router.push(`/post-guiders/mine/${data.id}`);
        } else window.open(`/post-guiders/${data.id}`, "_blank");
      }}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative oerflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full group-hover:brightness-90 transition  rounded-xl"
            src={data.cover || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="flex justify-between items-center">
          {data?.location?.country && (
            <div className="font-light text-neutral-500 text-ellipsis line-clamp-1">
              {data?.location?.country}
            </div>
          )}
        </div>
        <p className="line-clamp-2 font-semibold">{data.title}</p>
        <div className="flex flex-row items-center">
          <div className="font-light">{data.description}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostGuiderCardVertical;
