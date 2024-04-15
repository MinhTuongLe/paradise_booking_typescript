/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import "../../../styles/globals.css";
import {
  API_URL,
  booking_status,
  emptyAvatar,
  emptyImage,
  formatDateTimeType,
} from "@/const";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import dayjs from "dayjs";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const BookedGuiderClient: React.FC<any> = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState<number | null>(3 || null);

  // console.log(rating);

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      content: "",
      title: "",
    },
  });

  const setCustomValue = (id: any, value: number | string) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSend = async (data: RatingDataSubmit) => {
    // try {
    //   setIsLoading(true);
    //   const submitValues = {
    //     ...data,
    //     place_id: reservation?.data.place.id,
    //     booking_id: reservation?.data.id,
    //   };
    //   // console.log(submitValues);
    //   const accessToken = Cookie.get("accessToken");
    //   const config = {
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   };
    //   axios
    //     .post(`${API_URL}/booking_ratings`, submitValues, config)
    //     .then(() => {
    //       setIsLoading(false);
    //       toast.success("Comment Successfully");
    //       router.refresh();
    //     })
    //     .catch((err) => {
    //       toast.error("Comment Failed");
    //       setIsLoading(false);
    //     });
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // if (
  //   reservation?.user_id !== 0 &&
  //   (!authState || loggedUser?.id !== reservation?.user_id)
  // ) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  return (
    <div className="max-w-[768px] mx-auto px-4">
      {1 === 1 && (
        <h1 className="text-xl font-extrabold mt-10 mb-1 text-center text-rose-500">
          Booking Successfully! Please check your email in 1 day to confirm.
        </h1>
      )}
      <h1 className="text-2xl font-bold mt-10 mb-3">Reservation Details</h1>
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
              Post Guider name
            </span>
            <span className="text-[#828080] font-bold max-w-[20%] text-ellipsis">
              Booked ID: {1 || "-"}
            </span>
          </div>
          <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
            <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
              {booking_status.map(
                (item) =>
                  item.id === 1 && (
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
                        {item.name}
                      </span>
                    </div>
                  )
              )}
              <div className="font-extrabold text-[20px]">${9999 || 0}</div>
            </div>
            <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
              <div className="text-[16px] font-semibold">
                From: 29/03/2024 - 00:00:00
              </div>
              <div className="text-[16px] font-semibold">
                To: 29/03/2024 - 00:00:00
              </div>
            </div>
            <div className="flex justify-start items-center space-x-32 p-4">
              <div className="">
                <div className="text-[#828080] font-bold text-[14px]">
                  PURCHASED ON
                </div>
                <div className="text-[16px] font-semibold">
                  29/03/2024
                  {/* {dayjs(item.created_at).format(
                                formatDateTimeType.DMY_HMS
                              )} */}
                </div>
              </div>
              <div className="">
                <div className="text-[#828080] font-bold text-[14px]">
                  PAYMENT METHOD
                </div>
                <div className="text-[16px] font-semibold">
                  {2 === 2 ? "MOMO" : "COD"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6">
          <span className="font-bold text-[16px] text-[#828080]">
            Post Guider Details
          </span>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 mt-3">
            <Image
              height={100}
              width={100}
              alt="upload"
              className="rounded-2xl w-[100px] h-[100px]"
              src={emptyImage}
            />
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[20px]">
                  {"Guide by: Guider full name" || ""}
                </span>
                <span
                  className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
                  onClick={() => window.open(`/post-guiders/1`, "_blank")}
                >
                  Details
                </span>
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                Place name
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                {/* {`${
                reservation?.data.place?.address
                  ? reservation?.data.place?.address
                  : ""
              }`} */}
                Place address
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">
                {/* {`${
                reservation?.data.place?.city
                  ? reservation?.data.place?.city + ", "
                  : ""
              } ${reservation?.data.place?.country || "-"}`} */}
                Place country
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-[#828080] font-bold text-[14px] mb-3">
            USER INFORMATION
          </div>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 w-full">
            <Image
              src={emptyAvatar}
              width={64}
              height={64}
              className="rounded-full aspect-square"
              alt="Avatar"
            />
            <div className="flex justify-between items-start w-[60%]">
              <div>
                <div className="text-[16px] font-semibold">
                  Fullname:{" "}
                  <span className="ml-1 font-normal">
                    {"User full name" || "User username" || "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  Email:
                  <span className="ml-1 font-normal">
                    {"leminhtuong09122002@gmail.com" || "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  Phone:
                  <span className="ml-1 font-normal">
                    {"0909090090" || "-"}
                  </span>
                </div>
                {"Guest name" && (
                  <div className="text-[16px] font-semibold">
                    Guest:
                    <span className="ml-1 font-normal">
                      {"Guest name" || "-"}
                    </span>
                  </div>
                )}
                <div className="text-[16px] font-semibold">
                  Content to guider:
                  <span className="ml-1 font-normal">
                    {"Content to guider" || "-"}
                  </span>
                </div>
              </div>
              {/* <div>
                <div className="text-[16px] font-semibold">
                  Guestname:
                  <span className="ml-1 font-normal">
                    {reservation?.user ? getUserName(reservation.user) : "-"}
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
        {!isLoading && 5 === 5 && (
          <div className="mt-6">
            <div className="flex flex-col">
              <div className="font-bold text-[16px]">
                Please leave your contents so we can improve
              </div>
              <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 mt-3">
                <div className="flex items-center justify-start space-x-3">
                  <div className="text-[16px] font-semibold">
                    Express your level of satisfaction in stars
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
                            readOnly={1 !== 1 ? true : false}
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
                    placeholder="Title ..."
                    value={getValues("title")}
                    id="title"
                    readOnly={1 !== 1 ? true : false}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px]"
                    onChange={(e) => {
                      setCustomValue("content", e.target.value);
                    }}
                    placeholder="Content ..."
                    value={getValues("content")}
                    id="content"
                    readOnly={1 !== 1 ? true : false}
                  ></textarea>
                </div>
                {1 !== 1 && (
                  <div className="flex space-x-6 items-start justify-end">
                    <div className="float-right w-[120px]">
                      <Button
                        outline
                        label="Cancel"
                        onClick={() => {
                          reset();
                          setHover(null);
                        }}
                      />
                    </div>
                    <div className="float-right w-[120px]">
                      <Button label="Send" onClick={handleSubmit(handleSend)} />
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
