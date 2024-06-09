/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaComment } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { emptyAvatar } from "@/const";
import { RootState } from "@/store/store";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import CommentPostReview from "@/components/CommentPostReview";
import useLoginModal from "@/hook/useLoginModal";
import {
  CommentPostReviewType,
  CommentType,
  LikePostReviewType,
  ReplyCommentType,
} from "@/models/post";
import { Like } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { filterViolentComment } from "@/utils/comment";
import ShareDialog from "../Share/ShareDialog";

export interface PostReviewCommentSectionProps {
  post_review_id: number;
  likeCount: number;
  commentCount: number;
  liked: number;
  postReviewCommentData: CommentPostReviewType[];
}

const PostReviewCommentSection: React.FC<PostReviewCommentSectionProps> = ({
  post_review_id,
  likeCount,
  commentCount,
  liked,
  postReviewCommentData,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const loginModal = useLoginModal();
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const accessToken = Cookie.get("accessToken");
  const userId = Cookie.get("userId");

  const [commentData, setCommentData] = useState<CommentPostReviewType[]>(
    postReviewCommentData
  );
  const [commentContent, setCommentContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLike, setIsLike] = useState(liked);
  const [tmpLikeCount, setTmpLikeCount] = useState(likeCount);
  const [tmpCommentCount, setTmpCommentCount] = useState(commentCount);
  const [isExpandedAllComments, setIsExpandedAllComments] = useState(false);

  const getPostReviewComments = () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get(
        getApiRoute(RouteKey.PostReviewComments, {
          postReviewId: post_review_id,
        }),
        config
      )
      .then((response) => {
        setCommentData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLikePost = async () => {
    const accessToken = Cookie.get("accessToken");
    const userId = Cookie.get("userId");
    if (!authState && !accessToken) {
      loginModal.onOpen();
      return;
    }

    setIsLike(isLike === Like.Like ? Like.Dislike : Like.Like);
    setTmpLikeCount((prev) =>
      isLike === Like.Dislike ? (prev += 1) : (prev -= 1)
    );

    const submitValues: LikePostReviewType = {
      account_id: Number(userId),
      post_review_id: post_review_id,
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
        router.refresh();
      })
      .catch((err) => {
        setIsLike(isLike === Like.Like ? Like.Dislike : Like.Like);
        setTmpLikeCount((prev) =>
          isLike === Like.Dislike ? (prev += 1) : (prev -= 1)
        );
        toast.error(`${isLike ? "Like" : "Unlike"} ${t("general.failed")}`);
      });
  };

  const handleSendComment = async () => {
    if (!authState && !accessToken) {
      loginModal.onOpen();
      return;
    }

    if (!commentContent || commentContent === "") {
      toast.error(t("toast.comment-is-not-blank"));
      return;
    }

    // check violent comment
    const result: boolean = await filterViolentComment(commentContent);
    if (!result) {
      return;
    }

    const submitValues: CommentType = {
      account_id: Number(userId),
      post_review_id: post_review_id,
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
        setTmpCommentCount((prev) => (prev += 1));
        setCommentContent("");
        router.refresh();
      })
      .then(() => getPostReviewComments())
      .catch((err) => {
        toast.error(t("toast.comment-failed"));
      });
  };

  const handleReplyComment = async (content: string, id: number) => {
    if (!authState && !accessToken) {
      loginModal.onOpen();
      return;
    }

    if (!content || content === "") {
      toast.error(t("toast.comment-is-not-blank"));
      return;
    }

    // check violent comment
    const result: boolean = await filterViolentComment(content);
    if (!result) {
      return;
    }

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
        setTmpCommentCount((prev) => (prev += 1));
        setCommentContent("");
        router.refresh();
      })
      .then(() => getPostReviewComments())
      .catch((err) => {
        toast.error(t("toast.comment-failed"));
      });
  };

  const handleClearComment = () => {
    if (deleteId !== null) {
      setOpen(false);
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
          setTmpCommentCount((prev) => (prev -= 1));
        })
        .then(() => getPostReviewComments())
        .catch((err) => {
          toast.error(t("toast.delete-comment-failed"));
        });
    }
  };

  const handleClearReplyComment = (childIndex: number) => {
    if (childIndex !== null) {
      setOpen(false);
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
          setTmpCommentCount((prev) => (prev -= 1));
        })
        .then(() => getPostReviewComments())
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
        .then(() => getPostReviewComments())
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
        .then(() => getPostReviewComments())
        .catch((err) => {
          toast.error(t("toast.delete-comment-failed"));
        });
    }
  };

  useEffect(() => {
    if (!loginModal.isOpen && accessToken && !userId) {
      window.location.reload();
    }
  }, [loginModal.isOpen]);

  return (
    <div className="mx-auto">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content={t("components.comment")}
      />
      <div>
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
          <ShareDialog />
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
                    setDeleteId(comment.id!);
                    setOpen(true);
                  }}
                  appendChild={async (content: string) => {
                    await handleReplyComment(content, comment.id!);
                  }}
                  removeChild={(childIndex: number) => {
                    handleClearReplyComment(childIndex);
                  }}
                  updateComment={(index: number, content: string) => {
                    handleUpdateComment(index, content);
                  }}
                  updateChild={(childIndex: number, content: string) => {
                    handleUpdateReplyComment(childIndex, content);
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

export default PostReviewCommentSection;
