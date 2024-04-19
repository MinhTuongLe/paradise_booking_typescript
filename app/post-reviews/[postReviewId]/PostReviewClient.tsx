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
import { API_URL, emptyAvatar, emptyImage, formatDateType } from "@/const";
import Expandable from "@/components/Expandable";
import useLoginModal from "@/hook/useLoginModal";
import Loader from "@/components/Loader";
import { PostReview } from "@/models/post";
import dayjs from "dayjs";
import { Like } from "@/enum";
import { getOwnerName } from "@/utils/getUserInfo";
import { FaLocationDot } from "react-icons/fa6";
import PostReviewCommentSection from "@/components/post-reviews/PostReviewCommentSection";

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
      .get(`${API_URL}/post_reviews/${params?.postReviewId}`, config)
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
          <div className="col-span-2 bg-transparent pt-6">
            <Image
              src={postReviewData?.image || emptyImage}
              alt="listing"
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto max-h-[70vh]"
              style={{ objectFit: "contain" }}
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

            {/* <div className="flex justify-between items-center">
              <div className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-2">
                <AiFillLike size={24} />
                <span>{tmpLikeCount || 0}</span>
              </div>
              <div className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-2">
                <span>{tmpCommentCount || 0}</span>
                <FaComment size={20} />
              </div>
            </div>
            <div className="flex justify-between items-center px-3 py-2 mt-2 mb-2 border-t-gray-300 border-t-[1px] border-b-gray-300 border-b-[1px]">
              <div
                className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
                onClick={handleLikePost}
              >
                {isLike === Like.Like ? (
                  <AiFillLike size={24} />
                ) : (
                  <AiOutlineLike size={24} />
                )}
                <span>{t("components.like")}</span>
              </div>
              <div
                className="flex items-center justify-between cursor-pointer relative"
                onClick={scrollToShareOptionsSection}
                ref={shareOptionsSection}
              >
                <div className="flex items-center space-x-2 hover:text-rose-500 hover:underline">
                  <AiOutlineShareAlt />
                  <span className="text-[16px]">{t("components.share")}</span>
                </div>
                <div
                  ref={shareOptionsPickerSection}
                  className={`${
                    !isShowShareOptions
                      ? "hidden"
                      : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[30vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
                  }`}
                >
                  <div className="col-span-1 space-y-4">
                    <div
                      className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
                      onClick={handleCopyToClipboard}
                    >
                      <FaCopy
                        size={30}
                        style={{ color: "#05a569", marginRight: 16 }}
                      />
                      {t("components.copy-link")}
                    </div>
                    <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                      <FacebookShareButton
                        url={currentUrl}
                        hashtag={"#ParadiseBookingApp"}
                        className="w-full flex items-center"
                      >
                        <FacebookIcon
                          size={32}
                          round
                          style={{ marginLeft: 0, marginRight: 16 }}
                        />
                        Facebook
                      </FacebookShareButton>
                    </div>
                    <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                      <TwitterShareButton
                        title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴\n\n`}
                        url={currentUrl}
                        hashtags={["ParadiseBookingApp"]}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <TwitterIcon
                          size={32}
                          round
                          style={{ marginLeft: 0, marginRight: 16 }}
                        />
                        Twitter
                      </TwitterShareButton>
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4">
                    <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                      <EmailShareButton
                        subject="Paradise Booking Share"
                        body={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                  `}
                        separator={`\n`}
                        url={currentUrl}
                        className="w-full flex items-center"
                      >
                        <EmailIcon
                          size={32}
                          round
                          style={{ marginLeft: 0, marginRight: 16 }}
                        />
                        Email
                      </EmailShareButton>
                    </div>
                    <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                      <WhatsappShareButton
                        title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                    `}
                        separator={`\n`}
                        url={currentUrl}
                        className="w-full flex items-center"
                      >
                        <WhatsappIcon
                          size={32}
                          round
                          style={{ marginLeft: 0, marginRight: 16 }}
                        />
                        Whatsapp
                      </WhatsappShareButton>
                    </div>
                    <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                      <TelegramShareButton
                        title={`\n🌴🏖️ Explore the resort paradise at Paradise🏖️🌴`}
                        url={currentUrl}
                        className="w-full flex items-center"
                      >
                        <TelegramIcon
                          size={32}
                          round
                          style={{ marginLeft: 0, marginRight: 16 }}
                        />
                        Telegram
                      </TelegramShareButton>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="w-full p-2 mb-8 space-y-4">
              {commentData && commentData.length > 3 && (
                <div
                  className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
                  onClick={() =>
                    setIsExpandedAllComments(!isExpandedAllComments)
                  }
                >
                  {!isExpandedAllComments
                    ? t("components.show-all-comments")
                    : t("components.hide-all-comments")}
                </div>
              )}
              {commentData &&
                (commentData.length <= 3 ||
                  (commentData.length > 3 && isExpandedAllComments)) &&
                commentData.map(
                  (comment: CommentPostReviewType, index: number) => (
                    <div key={index}>
                      <CommentPostReview
                        deleteComment={() => {
                          setDeleteId(comment.id!);
                          setOpen(true);
                        }}
                        appendChild={(content: string) => {
                          handleReplyComment(content, comment.id!);
                        }}
                        removeChild={(childIndex: number) => {
                          handleClearReplyComment(childIndex);
                        }}
                        data={comment}
                      />
                    </div>
                  )
                )}
            </div>

            <div className="flex items-center space-x-2 relative">
              <Image
                width={60}
                height={60}
                src={loggedUser?.avatar || emptyAvatar}
                alt="Avatar"
                className="rounded-full h-[40px] w-[40px]"
                priority
              />
              <textarea
                onChange={(e) => setCommentContent(e.target.value)}
                value={commentContent}
                className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                rows={1}
                placeholder={t("components.give-your-comment")}
              ></textarea>
              <div
                className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                onClick={() => {
                  handleSendComment();
                }}
              >
                <IoMdSend size={24} />
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PostReviewClient;
