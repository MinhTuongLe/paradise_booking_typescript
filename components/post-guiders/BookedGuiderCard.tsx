"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { MouseEventHandler } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import i18n from "@/i18n/i18n";
import { booking_guider_status, emptyImage, formatDateType } from "@/const";
import { BookingGuider } from "@/models/post";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { getOwnerName } from "@/utils/getUserInfo";
import { BookingGuiderStatus } from "@/enum";

interface ReservationItemProps {
  onDelete: MouseEventHandler<SVGElement> | undefined;
  data: BookingGuider;
}

const BookedGuiderCard: React.FC<ReservationItemProps> = ({
  onDelete,
  data,
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
      className="col-span-1 group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-md">
            {t("general.booking-id")}: {data.id || "-"}
          </span>
          {(data.status_id === BookingGuiderStatus.Pending ||
            data.status_id === BookingGuiderStatus.Cancel) && (
            <MdDeleteOutline
              className="text-[20px] text-rose-500 cursor-pointer"
              onClick={onDelete}
            />
          )}
        </div>
        <div className="gap-1">
          <div className="text-md text-ellipsis line-clamp-1">
            {`${t("general.from")} ${dayjs(
              data.calendar_guider.date_from
            ).format(formatDateType.DMY)} ${t("general.to")} ${dayjs(
              data.calendar_guider.date_to
            ).format(formatDateType.DMY)}`}
          </div>
        </div>
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover aspect-square h-full w-full rounded-xl"
            src={data.post_guide.images[0] || emptyImage}
            alt="listing"
            priority
          />
        </div>
        <div className="flex flex-col items-start justify-between">
          <div className="font-semibold text-lg text-ellipsis line-clamp-1">
            {`${t("post-guider-feature.by")}: ${getOwnerName(
              data.post_guide.post_owner
            )}`}
          </div>
          <div className="flex gap-1 font-semibold">
            {getPriceFormated(data.total_price || 0)} VND
          </div>
        </div>
        <div className="text-md text-ellipsis line-clamp-1">
          {data.post_guide.title}
        </div>
        <div className="flex flex-row items-center justify-between">
          {booking_guider_status.map(
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
            onClick={() => router.push(`/booked-guiders/${data.id}`)}
          >
            {t("components.see-details")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookedGuiderCard;
