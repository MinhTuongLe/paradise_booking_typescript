/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IoMdSend } from "react-icons/io";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../../../styles/globals.css";
import { LIMIT, emptyAvatar } from "@/const";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import MyPostReview from "@/components/post-reviews/MyPostReview";
import usePostReviewModal from "@/hook/usePostReviewModal";
import Loader from "@/components/Loader";
import { PostReview } from "@/models/post";
import { Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const MyPostReviewsClient: React.FC<any> = () => {
  const { t } = useTranslation("translation", { i18n });
  const postReviewModal = usePostReviewModal();

  const commentParentRef = useRef<HTMLDivElement>(null);
  const accessToken = Cookie.get("accessToken");
  const userId = Cookie.get("userId");
  const params = useParams();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedComment, setIsExpandedComment] = useState<number[]>([]);
  const [postReviews, setPostReviews] = useState<PostReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        account_id: userId,
      },
    };
    try {
      const res = await axios.delete(
        getApiRoute(RouteKey.PostReviewDetails, { postReviewId: id }),
        config
      );
      if (res.data.data) {
        await getPostReviews(1, true);
        toast.success(t("toast.delete-post-review-successfully"));
      } else {
        toast.error(t("toast.delete-post-review-failed"));
      }
    } catch (error) {
      toast.error(t("toast.delete-post-review-failed"));
    }
    setIsLoading(false);
  };

  const getPostReviews = async (page = 1, reset = false) => {
    if (reset) {
      setPostReviews([]);
      setCurrentPage(1);
    }
    setIsLoading(true);
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: page,
        limit: params?.limit || LIMIT,
      },
    };

    await axios
      .post(
        getApiRoute(RouteKey.PostReviewListByUser, { userId }),
        null,
        config
      )
      .then((response) => {
        const newReviews = response?.data?.data?.data || [];
        if (newReviews.length < LIMIT) {
          setHasMore(false);
        }
        setPostReviews((prev) => [...prev, ...newReviews]);
        setIsLoading(false);
      })
      .catch((err) => {
        setPostReviews([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPostReviews();
  }, []);

  useEffect(() => {
    if (!postReviewModal.isOpen) {
      getPostReviews(1, true);
    }
  }, [postReviewModal.isOpen]);

  const handleViewMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getPostReviews(nextPage);
  };

  if (!accessToken || !userId || loggedUser?.role === Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExpandComment = (index: number) => {
    if (isExpandedComment.includes(index))
      setIsExpandedComment((prev) => prev.filter((item) => item !== index));
    else setIsExpandedComment((prev) => [...prev, index]);
  };

  const scrollToCommentSection = () => {
    if (commentParentRef.current) {
      const container = commentParentRef.current;
      const lastChild = container.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-center items-start w-full">
        <div className="flex-col space-y-12 w-[50%]">
          <div className="mt-10 border-[1px] rounded-xl border-slate-300 px-4 py-3 space-y-4">
            <div
              className="flex items-center space-x-2 relative"
              onClick={() => {
                postReviewModal.onOpen({ data: null, isEdit: false });
              }}
            >
              <Image
                width={60}
                height={60}
                src={loggedUser?.avatar || emptyAvatar}
                alt="Avatar"
                className="rounded-full h-[40px] w-[40px]"
                priority
              />
              <textarea
                disabled
                className="cursor-pointer resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                rows={1}
                placeholder={t("post-reviews-feature.what-are-you-thinking")}
              ></textarea>
              <div className="absolute right-10 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer">
                <IoMdSend size={24} />
              </div>
            </div>
            <hr />
            <div className="text-center text-lg text-slate-400">
              {t("post-reviews-feature.share-your-memorable-moments-here")}
            </div>
          </div>
          {!isLoading ? (
            postReviews.length > 0 ? (
              <>
                {postReviews.map((postReview: PostReview) => (
                  <div key={postReview.id}>
                    <MyPostReview
                      data={postReview}
                      owner={loggedUser}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
                {hasMore && (
                  <div className="w-full flex justify-center items-center">
                    <button
                      className="mt-4 px-6 py-3 bg-rose-500 text-white rounded"
                      onClick={handleViewMore}
                    >
                      {t("post-reviews-feature.view-more")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title={t("post-reviews-feature.no-post-review-found")}
                subtitle={t(
                  "post-reviews-feature.immediately-add-your-first-experience"
                )}
              />
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPostReviewsClient;
