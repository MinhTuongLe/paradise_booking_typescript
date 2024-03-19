"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import Button from "../Button.tsx";
import HeartButton from "../HeartButton.tsx";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { emptyImage } from "../../const.ts";
import { Place } from "@/models/place";
import { Booking } from "@/models/booking";
import { User } from "@/models/user";
import { RootState } from "@/store/store.ts";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";

interface ListingCardProps {
  key?: number;
  data: Place;
  reservation?: Booking;
  onAction?: any;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string | number;
  shrink?: boolean;
  currentUser?: User | undefined;
}

const PostReviewCardVertical: React.FC<any> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  shrink = false,
}) => {
  // const pathName = usePathname();
  // const router = useRouter();
  // const loggedUser = useSelector(
  //   (state: RootState) => state.authSlice.loggedUser
  // );

  // const handleCancel = useCallback(
  //   (e: any) => {
  //     e.stopPropagation();

  //     if (disabled) return;

  //     onAction?.(actionId);
  //   },
  //   [onAction, actionId, disabled]
  // );

  // const price_per_night = useMemo(() => {
  //   if (reservation) {
  //     return reservation.totalPrice;
  //   }

  //   return data.price_per_night;
  // }, [reservation, data.price_per_night]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      onClick={() => window.open(`/post-reviews/1`, "_blank")}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative oerflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full group-hover:brightness-90 transition  rounded-xl"
            src={
              "https://a0.muscache.com/im/pictures/e35bb307-05f4-48a4-bdc5-3b2198bb9451.jpg?im_w=1440" ||
              emptyImage
            }
            alt="listing"
            priority
          />
          {/* {shrink === false && loggedUser?.role !== 3 && (
            <div className="absolute top-3 right-3">
              <HeartButton listingId={data.id} isFree={data.is_free} />
            </div>
          )} */}
        </div>
        {/* {shrink === false && (
          <div className="font-semibold text-lg text-ellipsis line-clamp-1">
            {data.address
              ? data.address
              : `${data.district || "-"} ${
                  data.state ? `, ${data.state}` : "-"
                }`}
          </div>
        )} */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <div className="flex space-x-1 items-center">
              {1 === 1 ? <AiOutlineLike size={24} /> : <AiFillLike size={24} />}
              <span>(23)</span>
            </div>
            <div className="flex space-x-1 items-center">
              {1 === 1 ? (
                <FaRegCommentDots size={20} />
              ) : (
                <FaComment size={20} />
              )}
              <span>(23)</span>
            </div>
          </div>
          <div className="font-light text-neutral-500 text-ellipsis line-clamp-1">
            Vietnam
          </div>
        </div>
        <p className="line-clamp-2">
          Tìm hiểu và lên kế hoạch cho một chuyến đi Kyoto với cố vấn địa phương
          Yuko Tìm hiểu và lên kế hoạch cho một chuyến đi Kyoto với cố vấn địa
          phương Yuko
        </p>
        <div className="flex flex-row items-center">
          <div className="flex gap-1 font-semibold">
            From $8<div className="font-light"> / Tour</div>
          </div>
        </div>
        {/* {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )} */}
      </div>
    </motion.div>
  );
};

export default PostReviewCardVertical;
