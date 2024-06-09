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
import { FaComment, FaRegCommentDots } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { emptyAvatar, formatDateType } from "@/const";
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
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { filterViolentComment } from "@/utils/comment";
import ShareDialog from "../Share/ShareDialog";

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
      .post(getApiRoute(RouteKey.LikePostReview), submitValues, config)
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

    // check violent comment
    const result: boolean = await filterViolentComment(commentContent);
    if (!result) {
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
      .post(getApiRoute(RouteKey.CommentPostReview), submitValues, config)
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

    // check violent comment
    const result: boolean = await filterViolentComment(content);
    if (!result) {
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
      .post(getApiRoute(RouteKey.ReplyCommentPostReview), submitValues, config)
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
        .delete(
          getApiRoute(RouteKey.CommentPostReviewDetails, {
            commentId: deleteId,
          }),
          config
        )
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
        .delete(
          getApiRoute(RouteKey.ReplyCommentPostReviewDetails, {
            replyCommentId: childIndex,
          }),
          config
        )
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

  const handleUpdateComment = (index: number, content: string) => {
    if (index !== null) {
      if (!content || content === "") {
        toast.error(t("toast.comment-is-not-blank"));
        return;
      }

      const accessToken = Cookie.get("accessToken");

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .put(
          getApiRoute(RouteKey.CommentPostReviewDetails, {
            commentId: index,
          }),
          { content: content },
          config
        )
        .then(() => getPostReview())
        .catch((err) => {
          toast.error(t("toast.delete-comment-failed"));
        });
    }
  };

  const handleUpdateReplyComment = (childIndex: number, content: string) => {
    if (childIndex !== null) {
      if (!content || content === "") {
        toast.error(t("toast.comment-is-not-blank"));
        return;
      }

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .put(
          getApiRoute(RouteKey.ReplyCommentPostReviewDetails, {
            replyCommentId: childIndex,
          }),
          { content: content },
          config
        )
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
      params: {
        account_id: userId,
      },
    };

    await axios
      .get(
        getApiRoute(RouteKey.PostReviewDetails, {
          postReviewId: data.id,
        }),
        config
      )
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
          <ShareDialog className="bottom-0 right-0" />
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
                  appendChild={async (content: string) => {
                    await handleReplyComment(content, comment.id);
                  }}
                  removeChild={(childIndex: number) => {
                    handleClearReplyComment(childIndex);
                  }}
                  data={comment}
                  updateComment={(index: number, content: string) => {
                    handleUpdateComment(index, content);
                  }}
                  updateChild={(childIndex: number, content: string) => {
                    handleUpdateReplyComment(childIndex, content);
                  }}
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
            onClick={async () => {
              await handleSendComment();
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
