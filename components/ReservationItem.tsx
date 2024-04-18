"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { MouseEventHandler, useCallback, useMemo } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import { booking_status, emptyImage } from "@/const";
import { Booking } from "@/models/booking";
import { Reservation } from "@/models/place";
import { getPriceFormated } from "@/utils/getPriceFormated";

interface ReservationItemProps {
  onDelete: MouseEventHandler<SVGElement> | undefined;
  data: Booking | Reservation;
}

const ReservationItem: React.FC<ReservationItemProps> = ({
  onDelete,
  data,
}) => {
  const { t } = useTranslation("translation", { i18n });
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
          <span className="font-semibold text-md">
            {t("general.booking-id")}: {data.id || "-"}
          </span>
          <MdDeleteOutline
            className="text-[20px] text-rose-500 cursor-pointer"
            onClick={onDelete}
          />
        </div>
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full rounded-xl"
            src={data.place.cover || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="font-semibold text-lg text-ellipsis line-clamp-1">
          {data.place.name || "-"}
        </div>
        <div className="flex gap-1 font-semibold">
          {t("components.total")}:{" "}
          {getPriceFormated(data.place.price_per_night || 0)} VND
        </div>
        <div className="flex flex-row items-center justify-between">
          {booking_status.map(
            (item) =>
              item.id === data.status_id && (
                <div
                  key={item.id}
                  className={`gap-1 font-semibold bg-[${item.color}] text-white rounded-2xl w-[120px] h-[32px] flex items-center justify-center`}
                  style={{ backgroundColor: `${item.color}` }}
                >
                  {t(`booking-status.${item.name}`)}
                </div>
              )
          )}
          <span
            className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
            onClick={() => router.push(`/reservations/${data.id}`)}
          >
            {t("components.see-details")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReservationItem;
