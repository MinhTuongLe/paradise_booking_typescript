import { MAX_COMMENT_LENGTH, emptyAvatar } from "@/const";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdClose, IoMdSend } from "react-icons/io";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import CommentPostReviewItem from "./CommentPostReviewItem";
import {
  CommentPostReviewItemType,
  CommentPostReviewType,
  PostOwnerType,
} from "@/models/post";
import { CommentType } from "@/enum";

interface CommentPostReviewProps {
  deleteComment: () => void;
  // text: string;
  // child: CommentPostReviewItemType[] | null;
  // owner: PostOwnerType;
  appendChild: (data: string) => void;
  removeChild: (childIndex: number) => void;
  data: CommentPostReviewType;
}

const CommentPostReview: React.FC<CommentPostReviewProps> = ({
  deleteComment,
  // text,
  // child,
  // owner,
  data,
  appendChild,
  removeChild,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const [isShowRepComment, setIsShowRepComment] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isExpandedAllComments, setIsExpandedAllComments] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSendComment = () => {
    if (!commentContent || commentContent === "") {
      toast.error("Comments are not blank");
      return;
    }
    appendChild(commentContent);
    setIsShowRepComment(false);
    setCommentContent("");
    setIsExpandedAllComments(true);
  };

  const handleClearComment = () => {
    if (deleteId !== null) {
      removeChild(deleteId);
      setOpen(false);
    }
  };

  return (
    <div>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content={t("components.comment")}
      />
      <CommentPostReviewItem
        type={CommentType.Parent}
        // text={data.content}
        // owner={data.owner}
        data={data}
        toggle={isShowRepComment}
        action={() => {
          setIsShowRepComment(!isShowRepComment);
          setCommentContent("");
        }}
        onDelete={deleteComment}
      />
      <div className="pl-[48px]">
        {data.reply_comments &&
          data.reply_comments.length > MAX_COMMENT_LENGTH && (
            <div
              className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
              onClick={() => setIsExpandedAllComments(!isExpandedAllComments)}
            >
              {!isExpandedAllComments
                ? t("components.show-all-comments")
                : t("components.hide-all-comments")}
            </div>
          )}
        {data.reply_comments &&
          (data.reply_comments.length <= MAX_COMMENT_LENGTH ||
            (data.reply_comments.length > MAX_COMMENT_LENGTH &&
              isExpandedAllComments)) &&
          data.reply_comments.map(
            (comment: CommentPostReviewItemType, index: number) => (
              <div key={index}>
                <CommentPostReviewItem
                  // text={comment.content}
                  // owner={comment.owner}
                  data={comment}
                  type={CommentType.Child}
                  onDelete={() => {
                    setOpen(true);
                    setDeleteId(comment.id);
                  }}
                />
              </div>
            )
          )}
        {isShowRepComment && (
          <div className="flex items-center space-x-2 relative mt-3">
            <Image
              width={60}
              height={60}
              src={emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px]"
              priority
            />
            <textarea
              value={commentContent}
              className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
              rows={1}
              placeholder={t("components.give-your-comment")}
              onChange={(e) => setCommentContent(e.target.value)}
              autoFocus
            ></textarea>
            <div
              onClick={() => handleSendComment()}
              className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
            >
              <IoMdSend size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPostReview;
