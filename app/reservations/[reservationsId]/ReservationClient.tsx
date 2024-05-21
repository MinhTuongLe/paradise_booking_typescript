/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import "../../../styles/globals.css";
import {
  API_URL,
  booking_status,
  emptyAvatar,
  emptyImage,
  formatDateTimeType,
} from "@/const";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import { getUserName } from "@/utils/getUserInfo";
import { getPaymentMethodName } from "@/utils/getPaymentMethod";
import { BookingRatingType, BookingStatus, PaymentMethods, Role } from "@/enum";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const ReservationClient: React.FC<ReservationClientProps> = ({
  reservation,
  rating,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(rating?.rating || null);

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

  const handleSend = async (data: RatingDataSubmit) => {
    try {
      setIsLoading(true);

      const submitValues = {
        ...data,
        object_id: reservation?.data.place.id,
        booking_id: reservation?.data.id,
        object_type: BookingRatingType.BookingRatingTypePlace,
      };

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

  return (
    <div className="max-w-[768px] mx-auto px-4">
      {reservation?.data.status_id === BookingStatus.Pending && (
        <h1 className="text-xl font-extrabold mt-10 mb-1 text-center text-rose-500">
          {t("reservation-feature.booking-successfully")}
        </h1>
      )}
      <h1 className="text-2xl font-bold mt-10 mb-3">
        {t("reservation-feature.reservation-details")}
      </h1>
      <div className="mt-6">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[16px] max-w-[70%] text-ellipsis line-clamp-1">{`${
              reservation?.data.place?.address
                ? reservation?.data.place?.address + ", "
                : ""
            } ${reservation?.data.place.district}, ${
              reservation?.data.place.state
            }, ${reservation?.data.place.country}`}</span>
            <span className="text-[#828080] font-bold max-w-[20%] text-ellipsis">
              {t("general.booking-id")}: {reservation?.data.id || "-"}
            </span>
          </div>
          <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
            <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
              {booking_status.map(
                (item) =>
                  item.id === reservation?.data.status_id && (
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
                {getPriceFormated(reservation?.data.total_price || 0)} VND
              </div>
            </div>
            <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
              <div className="text-[16px] font-semibold">
                {t("general.from")}: {reservation?.data.checkin_date}
              </div>
              <div className="text-[16px] font-semibold">
                {t("general.to")}: {reservation?.data.checkout_date}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-32 p-4">
              <div className="">
                <div className="text-[#828080] font-bold text-[14px]">
                  {t("property-feature.booked-on")}
                </div>
                <div className="text-[16px] font-semibold">
                  {dayjs(reservation?.data.created_at).format(
                    formatDateTimeType.DMY_HMS
                  )}
                </div>
              </div>
              <div className="">
                <div className="text-[#828080] font-bold text-[14px] uppercase">
                  {t("property-feature.payment-method")}
                </div>
                <div className="text-[16px] font-semibold">
                  {getPaymentMethodName(reservation?.data.payment_method || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6">
          <span className="font-bold text-[16px] text-[#828080]">
            {t("reservation-feature.place-details")}
          </span>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 mt-3">
            <Image
              height={100}
              width={100}
              alt="upload"
              className="rounded-2xl w-[100px] h-[100px]"
              src={reservation?.data.place?.cover || emptyImage}
            />
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[20px]">
                  {reservation?.data.place?.name || ""}
                </span>
                <span
                  className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
                  onClick={() =>
                    window.open(
                      `/listings/${reservation?.data.place.id}`,
                      "_blank"
                    )
                  }
                >
                  {t("general.details")}
                </span>
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">{`${
                reservation?.data.place?.address
                  ? reservation?.data.place?.address
                  : ""
              }`}</div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">{`${
                reservation?.data.place?.city
                  ? reservation?.data.place?.city + ", "
                  : ""
              } ${reservation?.data.place?.country || "-"}`}</div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-[#828080] font-bold text-[14px] mb-3 uppercase">
            {t("property-feature.user-information")}
          </div>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 w-full">
            <Image
              src={reservation?.user.avatar || emptyAvatar}
              width={64}
              height={64}
              className="rounded-full aspect-square"
              alt="Avatar"
            />
            <div className="flex justify-between items-start w-[60%]">
              <div>
                <div className="text-[16px] font-semibold">
                  {t("general.fullname")}:{" "}
                  <span className="ml-1 font-normal">
                    {reservation?.user ? getUserName(reservation.user) : "User"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  {t("general.email")}:
                  <span className="ml-1 font-normal">
                    {reservation?.user.email || "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  {t("general.phone")}:
                  <span className="ml-1 font-normal">
                    {reservation?.user.phone || "-"}
                  </span>
                </div>
                {reservation?.data.guest_name && (
                  <div className="text-[16px] font-semibold">
                    {t("general.guest")}:
                    <span className="ml-1 font-normal">
                      {reservation?.data.guest_name || "-"}
                    </span>
                  </div>
                )}
                <div className="text-[16px] font-semibold">
                  {t("reservation-feature.content-to-vendor")}:
                  <span className="ml-1 font-normal">
                    {reservation?.data.content_to_vendor || "-"}
                  </span>
                </div>
              </div>
              {/* <div>
                <div className="text-[16px] font-semibold">
                  Guestname:
                  <span className="ml-1 font-normal">
                    {reservation?.user ? getUserName(reservation.user) :  "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  Phone:
                  <span className="ml-1 font-normal">
                    {reservation.user.phone || "-"}
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {!isLoading &&
          reservation?.data.status_id === BookingStatus.Completed && (
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
                                rating?.rating ||
                                rating?.title ||
                                rating?.content
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

export default ReservationClient;
