/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import useRoomCommentsModal from "@/hook/useRoomCommentsModal";
import { API_URL, emptyAvatar, formatDateTimeType } from "@/const";
import { Comment } from "@/models/place";
import Expandable from "../Expandable";
import { getUserName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

interface GuiderCommentsProps {
  place_id: number;
  rating_average: number;
}

const GuiderComments: React.FC<GuiderCommentsProps> = ({
  place_id,
  rating_average,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState<Comment[]>([]);
  const roomCommentsModal = useRoomCommentsModal();

  const getRatings = async () => {
    // setIsLoading(true);
    // const config = {
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // };
    // await axios
    //   .get(
    //     getApiRoute(RouteKey.BookingRatingsByObjectId, {
    //       listingId: place_id,
    //     }),
    //     config
    //   )
    //   .then((response) => {
    //     setRatings(response.data.data.ListRating);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     // toast.error("Something Went Wrong");
    //     setIsLoading(false);
    //   });
  };

  useEffect(() => {
    getRatings();
  }, []);

  return (
    <div className="bg-white overflow-hidden w-full my-8">
      {!isLoading && ratings && ratings.length > 0 ? (
        <>
          <div className="block mb-8">
            <div className="flex flex-col justify-start items-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex justify-center items-center space-x-4">
                  <Image
                    width={100}
                    height={100}
                    src="https://a0.muscache.com/pictures/ec500a26-609d-440f-b5d0-9e5f92afd478.jpg"
                    alt="Avatar"
                    priority
                  />
                  <div className="text-[92px] font-extrabold text-[#222]">
                    {rating_average}
                  </div>
                  <Image
                    width={100}
                    height={100}
                    src="https://a0.muscache.com/pictures/65bb2a6c-0bdf-42fc-8e1c-38cec04b2fa5.jpg"
                    alt="Avatar"
                    priority
                  />
                </div>
                <div className="text-2xl font-bold text-[#222] mb-2">
                  Ratings by clients
                </div>
                <div className="text-xl font-normal text-[#222] w-1/2 text-center">
                  One of Paradise's favorite places based on ratings, reviews
                  and trust
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="mt-8">
            <div className="grid grid-cols-2">
              {ratings.slice(0, 6).map((comment, index) => {
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
                    {/* <p className="line-clamp-3 text-md">{`"...${
                      comment?.DataRating?.content || "-"
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
        </>
      ) : (
        <div className="text-center text-xl font-bold">
          No comment to display
        </div>
      )}
      {!isLoading && ratings && ratings.length > 0 && (
        <div className="flex justify-between items-center w-full">
          <button
            className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-md border-[1px]"
            onClick={() => roomCommentsModal.onOpen(rating_average)}
          >
            Show all {ratings.length || 0} comments
          </button>
        </div>
      )}
    </div>
  );
};

export default GuiderComments;
