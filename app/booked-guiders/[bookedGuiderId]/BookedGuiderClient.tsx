/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import dayjs from "dayjs";

import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import "../../../styles/globals.css";
import {
  API_URL,
  booking_guider_status,
  booking_status,
  emptyAvatar,
  emptyImage,
  formatDateTimeType,
} from "@/const";
import i18n from "@/i18n/i18n";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import { BookingGuider } from "@/models/post";
import { User } from "@/models/user";
import { BookingGuiderStatus, BookingRatingType } from "@/enum";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { getOwnerName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export interface ReservationClientProps {
  data: BookingGuider;
  user: User | undefined | null;
  rating: RatingDataSubmit;
}

const BookedGuiderClient: React.FC<ReservationClientProps> = ({
  data,
  user,
  rating,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState<number | null>(rating?.rating || null);

  // console.log(rating);

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: rating?.rating || 0,
      content: rating?.content || "",
      title: rating?.title || "",
    },
    mode: "all",
  });

  const setCustomValue = (id: any, value: number | string) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSend = async (dataValue: RatingDataSubmit) => {
    try {
      setIsLoading(true);

      const submitValues = {
        ...dataValue,
        object_id: data?.post_guide.id,
        booking_id: data?.id,
        object_type: BookingRatingType.BookingRatingTypeGuide,
      };
      // console.log(submitValues);

      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .post(getApiRoute(RouteKey.BookingRatings), submitValues, config)
        .then(() => {
          setIsLoading(false);
          toast.success(t("toast.feedback-successfully"));
          router.refresh();
        })
        .catch((err) => {
          toast.error(t("toast.feedback-failed"));
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-[768px] mx-auto px-4">
      {data.status_id === BookingGuiderStatus.Pending && (
        <h1 className="text-xl font-extrabold mt-10 mb-1 text-center text-rose-500">
          {t("reservation-feature.booking-successfully")}{" "}
        </h1>
      )}
      <h1 className="text-2xl font-bold mt-10 mb-3">
        {t("post-guider-feature.reservation-details")}
      </h1>
      <div className="mt-6">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[16px] max-w-[70%] text-ellipsis line-clamp-1">
              {/* {`${
              reservation?.data.place?.address
                ? reservation?.data.place?.address + ", "
                : ""
            } ${reservation?.data.place.district}, ${
              reservation?.data.place.state
            }, ${reservation?.data.place.country}`} */}
              {data.post_guide.title}
            </span>
            <span className="text-[#828080] font-bold max-w-[20%] text-ellipsis">
              {t("general.booking-id")}: {data.id || "-"}
            </span>
          </div>
          <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
            <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
              {booking_guider_status.map(
                (item) =>
                  item.id === data.status_id && (
                    <div
                      className="space-x-2 flex justify-between items-center"
                      key={item.id}
                    >
                      {item?.icon && (
                        <>
                          {React.createElement(item.icon, {
                            size: 24,
                            className: `text-${item.color}`,
                            color: item.color,
                          })}
                        </>
                      )}
                      <span className="font-extrabold text-[20px]">
                        {t(`booking-status.${item.name}`)}
                      </span>
                    </div>
                  )
              )}
              <div className="font-extrabold text-[20px]">
                {getPriceFormated(data.total_price || 0)} VND
              </div>
            </div>
            <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
              <div className="text-[16px] font-semibold">
                {t("general.from")}:{" "}
                {dayjs(data.calendar_guider.date_from).format(
                  formatDateTimeType.DMY_HMS
                )}
              </div>
              <div className="text-[16px] font-semibold">
                {t("general.to")}:{" "}
                {dayjs(data.calendar_guider.date_to).format(
                  formatDateTimeType.DMY_HMS
                )}
              </div>
              <div className="text-[16px] font-semibold">
                {t("post-guider-feature.with")}: {data.number_of_people || 0}{" "}
                {t("post-guider-feature.person")}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-32 p-4">
              <div className="">
                <div className="text-[#828080] font-bold text-[14px] uppercase">
                  {t("property-feature.booked-on")}
                </div>
                <div className="text-[16px] font-semibold">
                  {dayjs(data.created_at).format(formatDateTimeType.DMY_HMS)}
                </div>
              </div>
              <div className="">
                <div className="text-[#828080] font-bold text-[14px] uppercase">
                  {t("property-feature.payment-method")}
                </div>
                <div className="text-[16px] font-semibold">
                  {data.payment_method}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6">
          <span className="font-bold text-[16px] text-[#828080]">
            {t("post-guider-feature.post-guider-details")}
          </span>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 mt-3">
            <Image
              height={100}
              width={100}
              alt="upload"
              className="rounded-2xl w-[100px] h-[100px]"
              src={data.post_guide.cover || emptyImage}
            />
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[20px]">
                  {`${t("post-guider-feature.guide-by")}: ${getOwnerName(
                    data.post_guide.post_owner
                  )}` || ""}
                </span>
                <span
                  className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
                  onClick={() =>
                    window.open(`/post-guiders/${data.post_guide.id}`, "_blank")
                  }
                >
                  {t("general.details")}
                </span>
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                {data.post_guide.title}
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                {`${
                  data.post_guide.address ? data.post_guide.address + ", " : ""
                }${
                  data.post_guide.location.district
                    ? data.post_guide.location.district + ", "
                    : ""
                }${
                  data.post_guide.location.state
                    ? data.post_guide.location.state + ", "
                    : ""
                }`}
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                {data.post_guide.location.country
                  ? data.post_guide.location.country
                  : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-[#828080] font-bold text-[14px] mb-3 uppercase">
            {t("property-feature.user-information")}
          </div>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 w-full">
            <Image
              src={user?.avatar || emptyAvatar}
              width={64}
              height={64}
              className="rounded-full aspect-square"
              alt="Avatar"
            />
            <div className="flex justify-between items-start w-[60%]">
              <div>
                <div className="text-[16px] font-semibold">
                  {t("general.fullname")}:{" "}
                  <span className="ml-1 font-normal">{data.name || "-"}</span>
                </div>
                <div className="text-[16px] font-semibold">
                  E-mail:
                  <span className="ml-1 font-normal">{data.email || "-"}</span>
                </div>
                <div className="text-[16px] font-semibold">
                  {t("general.phone")}:
                  <span className="ml-1 font-normal">{data.phone || "-"}</span>
                </div>
                <div className="text-[16px] font-semibold">
                  {t("post-guider-feature.content-to-guider")}:
                  <span className="ml-1 font-normal">{data.note || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isLoading && data?.status_id === BookingGuiderStatus.Completed && (
          <div className="mt-6">
            <div className="flex flex-col">
              <div className="font-bold text-[16px]">
                {t("reservation-feature.leave-contents")}
              </div>
              <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 mt-3">
                <div className="flex items-center justify-start space-x-3">
                  <div className="text-[16px] font-semibold">
                    {t("reservation-feature.express-satisfaction")}
                  </div>
                  <div className="flex space-x-2">
                    {[...Array(5)].map((star, index) => {
                      const currentRating = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onChange={() => {
                              setCustomValue("rating", currentRating);
                            }}
                            className="hidden"
                            readOnly={
                              rating?.rating || rating?.title || rating?.content
                                ? true
                                : false
                            }
                          />
                          <FaStar
                            size={30}
                            className="cursor-pointer"
                            color={
                              currentRating <= (hover || getValues("rating"))
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            onMouseEnter={() => setHover(currentRating)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="my-3">
                  <input
                    className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[64px]"
                    onChange={(e) => {
                      setCustomValue("title", e.target.value);
                    }}
                    placeholder={t("reservation-feature.title")}
                    value={getValues("title")}
                    id="title"
                    readOnly={
                      rating?.rating || rating?.title || rating?.content
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px]"
                    onChange={(e) => {
                      setCustomValue("content", e.target.value);
                    }}
                    placeholder={t("property-feature.content")}
                    value={getValues("content")}
                    id="content"
                    readOnly={
                      rating?.rating || rating?.title || rating?.content
                        ? true
                        : false
                    }
                  ></textarea>
                </div>
                {!rating?.rating && !rating?.title && !rating?.content && (
                  <div className="flex space-x-6 items-start justify-end">
                    <div className="float-right w-[120px]">
                      <Button
                        outline
                        label={t("general.cancel")}
                        onClick={() => {
                          reset();
                          setHover(null);
                        }}
                      />
                    </div>
                    <div className="float-right w-[120px]">
                      <Button
                        label={t("general.send")}
                        onClick={handleSubmit(handleSend)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedGuiderClient;
