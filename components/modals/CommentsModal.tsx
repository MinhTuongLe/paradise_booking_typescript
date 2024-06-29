/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import i18n from "@/i18n/i18n";
import useCommentsModal from "../../hook/useCommentsModal";
import Modal from "./Modal";
import "../../styles/globals.css";
import { API_URL, emptyAvatar, emptyImage, formatDateTimeType } from "@/const";
import Loader from "../Loader";
import { Place, Rating } from "@/models/place";
import { getUserName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { BookingRatingType, Role } from "@/enum";
import { PostGuider } from "@/models/post";

function CommentsModal({}) {
  const { t } = useTranslation("translation", { i18n });
  const commentsModal = useCommentsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const params = useParams();

  const toggle = useCallback(() => {
    commentsModal.onClose();
  }, [commentsModal]);

  const getRatings = async () => {
    setIsLoading(true);

    await axios
      .get(getApiRoute(RouteKey.BookingRatingsByVendorId), {
        params: {
          vendor_id: params?.usersId,
          object_type:
            commentsModal.userRole === Role.Vendor
              ? BookingRatingType.BookingRatingTypePlace
              : BookingRatingType.BookingRatingTypeGuide,
        },
      })
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

  useEffect(() => {
    if (commentsModal.isOpen) getRatings();
  }, [commentsModal.isOpen]);

  const bodyContent = (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          {ratings &&
            ratings.length > 0 &&
            ratings.map((rating, index) => (
              <div key={index}>
                <div className="w-full p-2 space-y-1">
                  <div className="w-full flex justify-between items-start">
                    <div className="flex w-[60%] flex-col justify-start items-start space-y-1">
                      <h1 className="text-xl font-bold space-y-3 text-ellipsis line-clamp-1">
                        {commentsModal.userRole === Role.Vendor
                          ? (rating?.place as Place).name || "-"
                          : (rating?.post_guide as PostGuider).title || "-"}
                      </h1>
                      <div className="text-sm font-bold space-y-2 text-ellipsis line-clamp-1">
                        {commentsModal.userRole === Role.Vendor
                          ? `${
                              (rating?.place as Place).address
                                ? (rating?.place as Place).address + ", "
                                : ""
                            } ${(rating?.place as Place).district}, ${
                              (rating?.place as Place).state
                            }, ${(rating?.place as Place).country}`
                          : `${
                              (rating?.post_guide as PostGuider).address
                                ? (rating?.post_guide as PostGuider).address +
                                  ", "
                                : ""
                            } ${(rating?.post_guide as any).district}, ${
                              (rating?.post_guide as any).state
                            }, ${(rating?.post_guide as any).country}`}
                      </div>
                    </div>
                    <div
                      className="w-[20%] flex justify-end items-start cursor-pointer"
                      onClick={() =>
                        window.open(
                          commentsModal.userRole === Role.Vendor
                            ? `/listings/${(rating?.place as Place).id}`
                            : `/post-guiders/${
                                (rating?.post_guide as PostGuider).id
                              }`,
                          "_blank"
                        )
                      }
                    >
                      <Image
                        width={80}
                        height={60}
                        src={
                          (commentsModal.userRole === Role.Vendor
                            ? (rating?.place as Place).images?.[0]
                            : (rating?.post_guide as PostGuider).images[0]) ||
                          emptyImage
                        }
                        alt="Avatar"
                        className="rounded-xl h-[60px] w-[80px]"
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex justify-start items-start space-x-6">
                    <div>
                      <Image
                        width={40}
                        height={40}
                        src={rating?.user.avatar || emptyAvatar}
                        priority
                        alt="Image"
                        className="rounded-full h-[40px] w-[40px]"
                      />
                      <div className="flex space-x-2 justify-between items-center">
                        <FaStar size={16} />
                        <span className="text-lg">
                          {rating?.DataRating?.rating || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-md font-bold space-y-3">
                        {rating?.user ? getUserName(rating.user) : "-"}
                      </h1>
                      <p>
                        {dayjs(rating.DataRating.created_at).format(
                          formatDateTimeType.DMY_HMS
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="line-clamp-5">{`"...${
                    rating.DataRating.content || "-"
                  }"`}</p>
                </div>
                <hr />
              </div>
            ))}
        </div>
      )}
    </>
  );

  const footerContent = (
    <>
      {/* <hr />
      <div className="flex justify-between items-center w-full">
        <button
          className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
          onClick={commentsModal.onOpen}
        >
          Show more comments
        </button>
      </div> */}
    </>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={commentsModal.isOpen}
      title={`${ratings.length || 0} ${t("components.comments")}`}
      onClose={commentsModal.onClose}
      body={bodyContent}
      footer={footerContent}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default CommentsModal;
