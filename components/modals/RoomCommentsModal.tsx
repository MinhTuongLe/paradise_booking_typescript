/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useRoomCommentsModal from "../../hook/useRoomCommentsModal";
import { API_URL, emptyAvatar, formatDateTimeType } from "@/const";
import Modal from "./Modal";
import Loader from "../Loader";
import { Rating } from "@/models/place";
import Expandable from "../Expandable";
import dayjs from "dayjs";
import { getUserName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

function RoomCommentsModal({}) {
  const { t } = useTranslation("translation", { i18n });
  const commentsModal = useRoomCommentsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [sumRatings, setSumRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<
    { count: number }[]
  >([]);

  const params = useParams();

  const getRatings = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    await axios
      .get(
        getApiRoute(RouteKey.BookingRatingsByPlace, {
          listingId: params?.listingId,
        }),
        config
      )
      .then((response) => {
        setRatings(response.data.data.ListRating);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const getRatingStatistic = async () => {
    setIsLoading(true);

    await axios
      .get(
        getApiRoute(RouteKey.BookingRatingsStatistic, {
          listingId: params?.listingId,
        })
      )
      .then((response) => {
        setRatingDistribution(response.data.data);
        setSumRatings(
          response.data.data.reduce(
            (sum: number, item: { count: number }) => sum + item.count,
            0
          )
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const get = async () => {
    await getRatings();
    await getRatingStatistic();
  };

  useEffect(() => {
    if (commentsModal.isOpen) {
      get();
    }
  }, [commentsModal.isOpen]);

  const bodyContent = (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <div className="flex flex-col space-y-4">
              <div className="space-y-1">
                <span className="text-2xl font-bold">
                  {ratings.length || 0} {t("components.comments")}
                </span>
                <div className="flex space-x-2 justify-start items-center">
                  <FaStar size={16} />
                  <span className="text-lg font-bold">
                    {commentsModal.rating_average || 0}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-md font-bold">
                  {t("components.summary")}
                </span>
                <div className="flex flex-col space-y-1">
                  <div className="flex space-x-2 items-center justify-start">
                    <span className="text-xs">{5}</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`bg-rose-500 rounded-full dark:bg-rose-300 h-full`}
                        style={{
                          width: `${
                            (ratingDistribution[4]?.count * 100) / sumRatings
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center justify-start">
                    <span className="text-xs">{4}</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`bg-rose-500 rounded-full dark:bg-rose-300 h-full`}
                        style={{
                          width: `${
                            (ratingDistribution[3]?.count * 100) / sumRatings
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center justify-start">
                    <span className="text-xs">{3}</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`bg-rose-500 rounded-full dark:bg-rose-300 h-full`}
                        style={{
                          width: `${
                            (ratingDistribution[2]?.count * 100) / sumRatings
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center justify-start">
                    <span className="text-xs">{2}</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`bg-rose-500 rounded-full dark:bg-rose-300 h-full`}
                        style={{
                          width: `${
                            (ratingDistribution[1]?.count * 100) / sumRatings
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center justify-start">
                    <span className="text-xs">{1}</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`bg-rose-500 rounded-full dark:bg-rose-300 h-full`}
                        style={{
                          width: `${
                            (ratingDistribution[0]?.count * 100) / sumRatings
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="flex flex-col">
              {!isLoading &&
                ratings &&
                ratings.length > 0 &&
                ratings.map((comment, index) => {
                  return (
                    <div key={index} className="w-full p-2 pr-[92px] mb-8">
                      <div className="flex justify-start items-center space-x-6 mb-2">
                        <Image
                          width={40}
                          height={40}
                          src={comment?.user?.avatar || emptyAvatar}
                          alt="Avatar"
                          className="rounded-full h-[40px] w-[40px]"
                          priority
                        />
                        <div>
                          <h1 className="text-lg font-bold space-y-3">
                            {comment?.user ? getUserName(comment.user) : "-"}
                          </h1>
                          <p className="text-lg">
                            {comment?.user?.address || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-start items-center space-x-6 mb-2">
                        <div className="flex space-x-2 justify-between items-center">
                          <FaStar size={16} />
                          <span className="text-lg">
                            {comment?.DataRating?.rating || 0}
                          </span>
                        </div>
                        <p className="text-md">
                          {dayjs(comment?.DataRating.created_at).format(
                            formatDateTimeType.DMY_HMS
                          )}
                        </p>
                      </div>
                      {/* <p className="line-clamp-3 text-md">{`"...${comment?.DataRating?.content || "-"
                        }"`}</p> */}
                      <Expandable
                        text={comment?.DataRating?.content}
                        maxCharacters={20}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const footerContent = <></>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={commentsModal.isOpen}
      title={`${ratings.length || 0} ${t("components.comments")}`}
      onClose={commentsModal.onClose}
      body={bodyContent}
      footer={footerContent}
      classname="sm:w-full md:w-3/4 lg:w-2/3 xl:w-1/2"
    />
  );
}

export default RoomCommentsModal;
