/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../../styles/globals.css";
import { emptyAvatar, emptyImage, formatDateType } from "@/const";
import Expandable from "@/components/Expandable";
import useLoginModal from "@/hook/useLoginModal";
import Loader from "@/components/Loader";
import { PostReview } from "@/models/post";
import dayjs from "dayjs";
import { Like } from "@/enum";
import { getOwnerName } from "@/utils/getUserInfo";
import { FaLocationDot } from "react-icons/fa6";
import PostReviewCommentSection from "@/components/post-reviews/PostReviewCommentSection";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const PostReviewClient = () => {
  const { t } = useTranslation("translation", { i18n });
  const params = useParams();
  const router = useRouter();
  const loginModal = useLoginModal();

  const accessToken = Cookie.get("accessToken");
  const userId = Cookie.get("userId");

  const [isLoading, setIsLoading] = useState(true);
  const [postReviewData, setPostReviewData] = useState<PostReview | null>(null);

  const getPostReview = () => {
    setIsLoading(true);
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        account_id: userId ? userId : "",
      },
    };

    axios
      .get(
        getApiRoute(RouteKey.PostReviewDetails, {
          postReviewId: params?.postReviewId,
        }),
        config
      )
      .then((response) => {
        setPostReviewData(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPostReview();
  }, []);

  useEffect(() => {
    if (!loginModal.isOpen && accessToken && !userId) {
      window.location.reload();
    }
  }, [loginModal.isOpen]);

  return (
    <div className="mx-auto">
      {!isLoading ? (
        <div className="grid grid-cols-3">
          <div className="col-span-2 bg-transparent">
            <Image
              src={postReviewData?.image || emptyImage}
              alt="listing"
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto max-h-[70vh]"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="px-4 py-6 relative max-h-[80vh] overflow-y-scroll vendor-room-listing"
            style={{ overflowX: "hidden" }}
          >
            <div className="flex justify-between items-center ">
              <div className="flex justify-start items-center space-x-4">
                <Image
                  width={60}
                  height={60}
                  src={postReviewData?.post_owner.avatar || emptyAvatar}
                  alt="Avatar"
                  className="rounded-full h-[40px] w-[40px] cursor-pointer"
                  priority
                  onClick={() =>
                    router.push(`/users/${postReviewData?.post_owner_id}`)
                  }
                />
                <div>
                  <h1
                    className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                    onClick={() =>
                      router.push(`/users/${postReviewData?.post_owner_id}`)
                    }
                  >
                    {postReviewData?.post_owner
                      ? getOwnerName(postReviewData.post_owner)
                      : "User"}
                  </h1>
                  <p className="text-sm">
                    {dayjs(postReviewData?.created_at).format(
                      formatDateType.DMY
                    )}
                  </p>
                </div>
              </div>
              {/* <BsThreeDots size={24} /> */}
            </div>
            <div className="font-bold text-lg mt-1">
              {postReviewData?.title}
            </div>
            {postReviewData?.content && (
              <div className=" flex flex-col pt-2 max-h-[70vh] overflow-y-scroll pb-4 overflow-x-hidden vendor-room-listing">
                <Expandable text={postReviewData.content} maxCharacters={100} />
              </div>
            )}
            {(postReviewData?.district ||
              postReviewData?.state ||
              postReviewData?.country) && (
              <div className="flex items-center mb-2">
                <FaLocationDot size={16} className="text-sky-400" />
                <div className="ml-2 font-thin text-sm text-slate-500">
                  {t("components.at")}{" "}
                  {postReviewData?.district && postReviewData?.district + ", "}{" "}
                  {postReviewData?.state && postReviewData?.state + ", "}{" "}
                  {postReviewData?.country || ""}
                </div>
              </div>
            )}

            <PostReviewCommentSection
              post_review_id={postReviewData?.id!}
              likeCount={postReviewData?.like_count || 0}
              commentCount={postReviewData?.comment_count || 0}
              liked={postReviewData?.is_liked ? Like.Like : Like.Dislike}
              postReviewCommentData={postReviewData?.comments || []}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PostReviewClient;
