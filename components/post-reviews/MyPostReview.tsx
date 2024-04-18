/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaComment, FaCopy, FaRegCommentDots } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  TelegramIcon,
} from "react-share";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import {
  API_URL,
  emptyAvatar,
  formatDateTimeType,
  formatDateType,
} from "@/const";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import usePostReviewModal from "@/hook/usePostReviewModal";
import Expandable from "../Expandable";
import {
  CommentPostReviewType,
  CommentType,
  LikePostReviewType,
  PostReview,
  ReplyCommentType,
} from "@/models/post";
import dayjs from "dayjs";
import { FaLocationDot } from "react-icons/fa6";
import { User } from "@/models/user";
import { getUserName } from "@/utils/getUserInfo";
import CommentPostReview from "../CommentPostReview";
import { Like } from "@/enum";

export interface MyPostReviewProps {
  data: PostReview;
  owner: User | null;
  onDelete: (id: number) => void;
}

const MyPostReview: React.FC<MyPostReviewProps> = ({
  data,
  owner,
  onDelete,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const accessToken = Cookie.get("accessToken");
  const userId = Cookie.get("userId");

  const router = useRouter();
  const postReviewModal = usePostReviewModal();
  const [isShowShareOptions, setIsShowShareOptions] = useState(false);
  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);
  const commentParentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuParentRef = useRef<HTMLDivElement>(null);

  const currentUrl = window.location.href;
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [openModalDeletePost, setOpenModalDeletePost] = useState(false);
  const [commentData, setCommentData] = useState<CommentPostReviewType[] | []>(
    data?.comments || []
  );
  const [commentContent, setCommentContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLike, setIsLike] = useState(
    data.is_liked ? Like.Like : Like.Dislike
  );
  const [tmpLikeCount, setTmpLikeCount] = useState(data.like_count);
  const [tmpCommentCount, setTmpCommentCount] = useState(data.comment_count);
  const [isExpandedAllComments, setIsExpandedAllComments] = useState(false);

  const scrollToShareOptionsSection = () => {
    if (shareOptionsSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        shareOptionsSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowShareOptions((prev) => !prev);
    }
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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success(t("toast.copy-successfully"));
  };

  const handleLikePost = async () => {
    setIsLike(isLike === Like.Like ? Like.Dislike : Like.Like);
    setTmpLikeCount((prev) =>
      isLike === Like.Dislike ? (prev += 1) : (prev -= 1)
    );

    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const userId = Cookie.get("userId");

    const submitValues: LikePostReviewType = {
      account_id: Number(userId),
      post_review_id: data.id,
      type: isLike === Like.Like ? Like.Dislike : Like.Like,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .post(`${API_URL}/like_post_reviews`, submitValues, config)
      .then(() => {
        // toast.success(`${isLike ? "Like" : "Unlike"} Successfully`);
        router.refresh();
      })
      .catch((err) => {
        setIsLike(isLike === Like.Like ? Like.Dislike : Like.Like);
        setTmpLikeCount((prev) =>
          isLike === Like.Dislike ? (prev += 1) : (prev -= 1)
        );
        toast.error(`${isLike ? "Like" : "Unlike"} ${t("general.failed")}`);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSendComment = async () => {
    if (!commentContent || commentContent === "") {
      toast.error(t("toast.comment-is-not-blank"));
      return;
    }

    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const userId = Cookie.get("userId");

    const submitValues: CommentType = {
      account_id: Number(userId),
      post_review_id: data.id,
      content: commentContent,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .post(`${API_URL}/post_review/comment`, submitValues, config)
      .then(() => {
        // toast.success("Comment Successfully");
        setTmpCommentCount((prev) => (prev += 1));
        setCommentContent("");
        router.refresh();
      })
      .then(() => getPostReview())
      .catch((err) => {
        toast.error(t("toast.comment-failed"));
      })
      .finally(() => setIsLoading(false));
  };

  const handleReplyComment = async (content: string, id: number) => {
    if (!content || content === "") {
      toast.error(t("toast.comment-is-not-blank"));
      return;
    }

    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const userId = Cookie.get("userId");

    const submitValues: ReplyCommentType = {
      account_id: Number(userId),
      content: content,
      source_comment_id: id,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .post(`${API_URL}/reply_comments`, submitValues, config)
      .then(() => {
        // toast.success("Comment Successfully");
        setTmpCommentCount((prev) => (prev += 1));
        setCommentContent("");
        router.refresh();
      })
      .then(() => getPostReview())
      .catch((err) => {
        toast.error(t("toast.comment-failed"));
      })
      .finally(() => setIsLoading(false));
  };

  const handleClearComment = () => {
    if (deleteId !== null) {
      setIsLoading(true);
      const accessToken = Cookie.get("accessToken");

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .delete(`${API_URL}/comments/${deleteId}`, config)
        .then(() => {
          // toast.success("Delete comment Successfully");
          setTmpCommentCount((prev) => (prev -= 1));
        })
        .then(() => getPostReview())
        .catch((err) => {
          toast.error(t("toast.delete-comment-failed"));
        })
        .finally(() => {
          setOpen(false);
          setIsLoading(false);
        });
    }
  };

  const handleClearReplyComment = (childIndex: number) => {
    if (childIndex !== null) {
      const accessToken = Cookie.get("accessToken");

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .delete(`${API_URL}/reply_comments/${childIndex}`, config)
        .then(() => {
          // toast.success("Delete comment Successfully");
          setTmpCommentCount((prev) => (prev -= 1));
        })
        .then(() => getPostReview())
        .catch((err) => {
          toast.error(t("toast.delete-comment-failed"));
        });
    }
  };

  const handleDelete = async () => {
    onDelete(data.id);
    setOpenModalDeletePost(false);
  };

  const getPostReview = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .get(`${API_URL}/post_reviews/${data.id}?account_id=${userId}`, config)
      .then((response) => {
        const post = response.data.data as PostReview;
        setCommentData(post.comments || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareOptionsSection.current &&
        !shareOptionsSection.current.contains(event.target as Node) &&
        shareOptionsPickerSection.current &&
        !shareOptionsPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowShareOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareOptionsSection, shareOptionsPickerSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuParentRef.current &&
        !menuParentRef.current.contains(event.target as Node)
      ) {
        setIsShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, menuParentRef]);

  return (
    <div className="mx-auto">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content={t("components.comment")}
      />
      <ConfirmDeleteModal
        isOpen={openModalDeletePost}
        onClose={() => setOpenModalDeletePost(false)}
        onDelete={handleDelete}
        content={t("components.post-review")}
      />
      <div
        className="px-4 py-6 relative overflow-y-scroll vendor-room-listing"
        style={{ overflowX: "hidden" }}
        ref={commentParentRef}
      >
        <div className="flex justify-between items-center ">
          <div className="flex justify-start items-center space-x-4 mb-2">
            <Image
              width={60}
              height={60}
              src={owner?.avatar || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] cursor-pointer"
              priority
              onClick={() => router.push(`/users/${owner?.id}`)}
            />
            <div>
              <h1
                className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                onClick={() => router.push(`/users/${owner?.id}`)}
              >
                {owner ? getUserName(owner) : "User"}
              </h1>
              <p className="text-sm">
                {dayjs(data.created_at).format(formatDateType.DMY)}
              </p>
            </div>
          </div>
          <div
            ref={menuRef}
            className="relative cursor-pointer"
            onClick={() => setIsShowMenu((pre) => !pre)}
          >
            <BsThreeDots size={24} />
            {isShowMenu && (
              <div
                className={`absolute right-0 top-[100%] w-[300px] bg-white rounded-xl overflow-hidden shadow-lg shadow-slate-400 border-[1px] border-slate-200`}
                ref={menuParentRef}
              >
                <div
                  className="bg-white px-4 py-3 flex justify-start gap-3 items-center border-b-[1px] border-b-slate-200"
                  onClick={() => {
                    postReviewModal.onOpen({ data: data.id, isEdit: true });
                  }}
                >
                  <MdEdit size={24} />
                  <span className="text-lg">
                    {t("components.edit-this-post")}
                  </span>
                </div>
                <div
                  className="bg-white px-4 py-3 flex justify-start gap-3 items-center"
                  onClick={() => setOpenModalDeletePost(true)}
                >
                  <RiDeleteBin5Line size={24} />
                  <span className="text-lg">
                    {t("components.delete-this-post")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {data.image && (
          <Image
            src={data.image}
            alt="listing"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto max-h-[70vh] mb-4 cursor-pointer"
            style={{ objectFit: "contain" }}
            onClick={() => router.push(`/post-reviews/${data.id}`)}
          />
        )}
        <div className="text-lg font-bold flex flex-col pt-2 max-h-[70vh] overflow-y-scroll pb-0 overflow-x-hidden vendor-room-listing">
          <Expandable text={data.title} maxCharacters={100} />
        </div>
        <div className=" flex flex-col max-h-[70vh] overflow-y-scroll pb-6 overflow-x-hidden vendor-room-listing">
          <Expandable text={data.content} maxCharacters={100} />
        </div>
        {(data?.district || data?.state || data?.country) && (
          <div className="flex items-center mb-2">
            <FaLocationDot size={16} className="text-sky-400" />
            <div className="ml-2 font-thin text-sm text-slate-500">
              {t("components.at")} {data?.district && data?.district + ", "}{" "}
              {data?.state && data?.state + ", "} {data?.country || ""}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
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
            className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
            onClick={() => {
              getPostReview();
            }}
          >
            <FaRegCommentDots size={20} />
            <span className="capitalize">{t("components.comment")}</span>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer relative"
            onClick={scrollToShareOptionsSection}
            ref={shareOptionsSection}
          >
            <AiOutlineShareAlt />
            <span className="text-[16px] ml-2 underline">
              {t("components.share")}
            </span>
            <div
              ref={shareOptionsPickerSection}
              className={`${
                !isShowShareOptions
                  ? "hidden"
                  : "absolute grid grid-cols-2 space-x-4 px-6 py-5 bottom-0 right-0 z-10 w-[30vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
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
                  {t("general.copy-link")}
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
        </div>

        <div className="w-full p-2 mb-8 space-y-4">
          {commentData && commentData.length > 3 && (
            <div
              className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
              onClick={() => setIsExpandedAllComments(!isExpandedAllComments)}
            >
              {!isExpandedAllComments
                ? t("components.show-all-comments")
                : t("components.hide-all-comments")}
            </div>
          )}
          {commentData &&
            (commentData.length <= 3 ||
              (commentData.length > 3 && isExpandedAllComments)) &&
            commentData.map((comment: CommentPostReviewType, index: number) => (
              <div key={index}>
                <CommentPostReview
                  deleteComment={() => {
                    setDeleteId(comment.id);
                    setOpen(true);
                  }}
                  // text={comment.content}
                  // child={comment?.reply_comments || null}
                  // owner={comment.owner}
                  appendChild={(content: string) => {
                    handleReplyComment(content, comment.id);
                  }}
                  removeChild={(childIndex: number) => {
                    handleClearReplyComment(childIndex);
                  }}
                  data={comment}
                />
              </div>
            ))}
        </div>

        <div className="flex items-center space-x-2 relative">
          <Image
            width={60}
            height={60}
            src={owner?.avatar || emptyAvatar}
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
        </div>
      </div>
    </div>
  );
};

export default MyPostReview;
