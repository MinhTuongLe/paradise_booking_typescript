"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

import Button from "../Button.tsx";
import HeartButton from "../HeartButton.tsx";
import { emptyImage } from "../../const.ts";
import { Place } from "@/models/place";
import { Booking } from "@/models/booking";
import { User } from "@/models/user";
import { RootState } from "@/store/store.ts";

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

const PostGuiderCardHorizontal: React.FC<any> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  shrink = false,
}) => {
  // const pathName = usePathname();
  const router = useRouter();
  // const loggedUser = useSelector((state: RootState) => state.authSlice.loggedUser);

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
      className="col-span-1 cursor-pointer group"
      onClick={() => router.push(`post-guiders/collections/1`)}
    >
      <div className="flex flex-col gap-2 w-full relative">
        <div className="aspect-video w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-video h-full w-full group-hover:scale-110 transition rounded-xl"
            src={
              "https://a0.muscache.com/im/pictures/e35bb307-05f4-48a4-bdc5-3b2198bb9451.jpg?im_w=1440" ||
              emptyImage
            }
            alt="listing"
            priority
          />
        </div>
        <div className="absolute top-4 left-4 max-w-[50%] overflow-hidden">
          <div className="font-light text-white line-clamp-2 break-words">
            Collection
          </div>
          <div className="text-white line-clamp-2 break-words text-2xl font-bold">
            The most popular in the world
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button
            outline
            label="Show all"
            onClick={() => router.push(`post-guiders/collections/1`)}
            classnames="px-4 py-[4px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PostGuiderCardHorizontal;
