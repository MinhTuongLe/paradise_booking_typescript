"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { MouseEventHandler, useCallback, useMemo } from "react";
import { MdDeleteOutline } from "react-icons/md";

import { booking_status, emptyImage } from "@/const";
import { Booking } from "@/models/booking";
import { Reservation } from "@/models/place";

interface ReservationItemProps {
  onDelete: MouseEventHandler<SVGElement> | undefined;
  data: Booking | Reservation;
}

const BookedGuiderCard: React.FC<any> = ({ onDelete }) => {
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
      className="col-span-1 group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-md">Booked ID: {1 || "-"}</span>
          <MdDeleteOutline
            className="text-[20px] text-rose-500 cursor-pointer"
            onClick={onDelete}
          />
        </div>
        <div className="gap-1">
          <div className="text-md text-ellipsis line-clamp-1">
            {"From: 28/03/24 - 00:00:00"}
          </div>
        </div>
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full rounded-xl"
            src={emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="font-semibold text-lg text-ellipsis line-clamp-1">
            {"By: Guider"}
          </div>
          <div className="flex gap-1 font-semibold">${9999 || 0}</div>
        </div>
        <div className="text-md text-ellipsis line-clamp-1">{"Place name"}</div>
        <div className="flex flex-row items-center justify-between">
          {booking_status.map(
            (item) =>
              item.id === 1 && (
                <div
                  key={item.id}
                  className={`gap-1 font-semibold bg-[${item.color}] text-white rounded-2xl w-[120px] h-[32px] flex items-center justify-center`}
                  style={{ backgroundColor: `${item.color}` }}
                >
                  {item.name}
                </div>
              )
          )}
          <span
            className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
            onClick={() => router.push(`/booked-guiders/1`)}
          >
            See details
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookedGuiderCard;