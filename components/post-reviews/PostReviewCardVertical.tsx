"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";

import { emptyImage } from "../../const.ts";
import { PostReview } from "@/models/post.ts";

interface PostReviewCardVerticalProps {
  data: PostReview;
}

const PostReviewCardVertical: React.FC<PostReviewCardVerticalProps> = ({
  data,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      onClick={() => window.open(`/post-reviews/${data.id}`, "_blank")}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative oerflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full group-hover:brightness-90 transition  rounded-xl"
            src={data?.image || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <div className="flex space-x-1 items-center">
              {data.is_liked ? (
                <AiOutlineLike size={24} />
              ) : (
                <AiFillLike size={24} />
              )}
              <span>({data.like_count})</span>
            </div>
            <div className="flex space-x-1 items-center">
              {1 === 1 ? (
                <FaRegCommentDots size={20} />
              ) : (
                <FaComment size={20} />
              )}
              <span>({data.comment_count})</span>
            </div>
          </div>
          {data?.country && (
            <div className="font-light text-neutral-500 text-ellipsis line-clamp-1">
              {data?.country}
            </div>
          )}
        </div>
        <p className="line-clamp-1 font-semibold text-ellipsis">{data.title}</p>
        <div className="flex flex-row items-center">
          <div className="font-light line-clamp-2 text-ellipsis">
            {data.content}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostReviewCardVertical;
