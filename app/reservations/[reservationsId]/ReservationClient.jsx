/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import { useEffect, useState, useMemo, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import "../../../styles/globals.css";
import { API_URL, booking_status, emptyAvatar, emptyImage} from "@/const";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import EmptyState from "@/components/EmptyState";

function ReservationClient({ reservation, rating }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector((state) => state.authSlice.loggedUser);
  const authState = useSelector((state) => state.authSlice.authState);

  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(rating?.rating || null);

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
  });

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSend = async (data) => {
    try {
      setIsLoading(true);

      const submitValues = {
        ...data,
        place_id: reservation.data.place.id,
        booking_id: reservation.data.id,
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
        .post(`${API_URL}/booking_ratings`, submitValues, config)
        .then(() => {
          setIsLoading(false);
          toast.success("Comment Successfully");
          router.refresh();
        })
        .catch((err) => {
          toast.error("Comment Failed");
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (
    reservation.user_id !== 0 &&
    (!authState || loggedUser.id !== reservation.user_id)
  ) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <div className="max-w-[768px] mx-auto px-4">
      {reservation.data.status_id === 1 && (
        <h1 className="text-xl font-extrabold mt-10 mb-1 text-center text-rose-500">
          Booking Successfully! Please check your email in 1 day to confirm.
        </h1>
      )}
      <h1 className="text-2xl font-bold mt-10 mb-3">Reservation Details</h1>
      <div className="mt-6">
        <div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[16px] max-w-[70%] text-ellipsis line-clamp-1">{`${
              reservation.data.place?.address
                ? reservation.data.place?.address + ", "
                : ""
            } ${reservation.data.place.district}, ${
              reservation.data.place.state
            }, ${reservation.data.place.country}`}</span>
            <span className="text-[#828080] font-bold max-w-[20%] text-ellipsis">
              Booking ID: {reservation.data.id || "-"}
            </span>
          </div>
          <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
            <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
              {booking_status.map(
                (item) =>
                  item.id === reservation.data.status_id && (
                    <div
                      className="space-x-2 flex justify-between items-center"
                      key={item.id}
                    >
                      <div className={`bg-[#${item.color}] p-1 rounded-full`}>
                        {item.icon}
                      </div>
                      <span className="font-extrabold text-[20px]">
                        {item.name}
                      </span>
                    </div>
                  )
              )}
              <div className="font-extrabold text-[20px]">
                ${reservation.data.total_price || 0}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
              <div className="text-[16px] font-semibold">
                From: {reservation.data.checkin_date}
              </div>
              <div className="text-[16px] font-semibold">
                To: {reservation.data.checkout_date}
              </div>
            </div>
            <div className="flex justify-start items-center space-x-32 p-4">
              <div className="">
                <div className="text-[#828080] font-bold text-[14px]">
                  PURCHASED ON
                </div>
                <div className="text-[16px] font-semibold">
                  {reservation.data.created_at
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") || "-"}
                </div>
              </div>
              <div className="">
                <div className="text-[#828080] font-bold text-[14px]">
                  PAYMENT METHOD
                </div>
                <div className="text-[16px] font-semibold">
                  {reservation.data?.payment_method === 2 ? "MOMO" : "COD"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6">
          <span className="font-bold text-[16px] text-[#828080]">
            Place Details
          </span>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 mt-3">
            <Image
              height={100}
              width={100}
              alt="upload"
              className="rounded-2xl w-[100px] h-[100px]"
              src={reservation.data.place?.cover || emptyImage}
            />
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[20px]">
                  {reservation.data.place?.name || ""}
                </span>
                <span
                  className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
                  onClick={() =>
                    window.open(
                      `/listings/${reservation.data.place.id}`,
                      "_blank"
                    )
                  }
                >
                  Details
                </span>
              </div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">{`${
                reservation.data.place?.address
                  ? reservation.data.place?.address
                  : ""
              }`}</div>
              <div className="text-[16px] font-semibold text-ellipsis line-clamp-1">{`${
                reservation.data.place?.city
                  ? reservation.data.place?.city + ", "
                  : ""
              } ${reservation.data.place?.country || "-"}`}</div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-[#828080] font-bold text-[14px] mb-3">
            USER INFORMATION
          </div>
          <div className="rounded-xl border-[#cdcdcd] border-[1px] p-4 flex justify-start items-start space-x-6 w-full">
            <Image
              src={reservation.user.avatar || emptyAvatar}
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
                    {reservation.user.full_name ||
                      reservation.user.username ||
                      "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  Email:
                  <span className="ml-1 font-normal">
                    {reservation.user.email || "-"}
                  </span>
                </div>
                <div className="text-[16px] font-semibold">
                  Phone:
                  <span className="ml-1 font-normal">
                    {reservation.user.phone || "-"}
                  </span>
                </div>
                {reservation.data.guest_name && (
                  <div className="text-[16px] font-semibold">
                    Guest:
                    <span className="ml-1 font-normal">
                      {reservation.data.guest_name || "-"}
                    </span>
                  </div>
                )}
                <div className="text-[16px] font-semibold">
                  Content to vendor:
                  <span className="ml-1 font-normal">
                    {reservation.data.content_to_vendor || "-"}
                  </span>
                </div>
              </div>
              {/* <div>
                <div className="text-[16px] font-semibold">
                  Guestname:
                  <span className="ml-1 font-normal">
                    {reservation.user.full_name || "-"}
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
        {!isLoading && reservation.data.status_id === 5 && (
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
                            readOnly={
                              rating?.rating || rating?.title || rating?.content
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
                    placeholder="Title ..."
                    value={getValues("title")}
                    id="title"
                    readOnly={
                      rating?.rating || rating?.title || rating?.content
                    }
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
                    readOnly={
                      rating?.rating || rating?.title || rating?.content
                    }
                  ></textarea>
                </div>
                {!rating?.rating && !rating?.title && !rating?.content && (
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
}

export default ReservationClient;
