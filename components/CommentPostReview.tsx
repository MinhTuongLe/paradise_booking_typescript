import { emptyAvatar } from "@/const";
import Image from "next/image";
import React, { useState } from "react";
import Expandable from "./Expandable";
import { FaHeart } from "react-icons/fa";
import { IoMdClose, IoMdSend } from "react-icons/io";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import CommentPostReviewItem from "./CommentPostReviewItem";
import { toast } from "react-toastify";
import { CommentPostReviewItemType } from "@/models/post";

interface CommentPostReviewProps {
  text: string;
  deleteComment: () => void;
  child: CommentPostReviewItemType[] | null;
  appendChild: (data: string) => void;
  removeChild: (childIndex: number) => void;
}

const CommentPostReview: React.FC<CommentPostReviewProps> = ({
  text,
  deleteComment,
  child,
  appendChild,
  removeChild,
}) => {
  const [isShowRepComment, setIsShowRepComment] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isExpandedAllComments, setIsExpandedAllComments] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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
    if (deleteIndex !== null) {
      removeChild(deleteIndex);
      setOpen(false);
    }
  };

  return (
    <div>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content="comment"
      />
      <CommentPostReviewItem
        type={1}
        text={text}
        toggle={isShowRepComment}
        action={() => {
          setIsShowRepComment(!isShowRepComment);
          setCommentContent("");
        }}
        onDelete={deleteComment}
      />
      <div className="pl-[48px]">
        {child && child.length > 3 && (
          <div
            className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
            onClick={() => setIsExpandedAllComments(!isExpandedAllComments)}
          >
            {!isExpandedAllComments ? "Show all comments" : "Hide all comments"}
          </div>
        )}
        {child &&
          (child.length <= 3 || (child.length > 3 && isExpandedAllComments)) &&
          child.map((content: CommentPostReviewItemType, index: number) => (
            <div key={index}>
              <CommentPostReviewItem
                text={content.content}
                type={2}
                onDelete={() => {
                  setOpen(true);
                  setDeleteIndex(index);
                }}
              />
            </div>
          ))}
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
              placeholder="Give your comment ..."
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
