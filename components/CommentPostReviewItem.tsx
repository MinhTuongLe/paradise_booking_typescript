import { emptyAvatar } from "@/const";
import Image from "next/image";
import React, { useState } from "react";
import Expandable from "./Expandable";
import { FaHeart } from "react-icons/fa";
import { IoMdClose, IoMdSend } from "react-icons/io";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface CommentPostReviewItemProps {
  text: string;
  toggle?: boolean;
  action?: () => void;
  type: number;
  onDelete?: () => void;
}

const CommentPostReviewItem: React.FC<CommentPostReviewItemProps> = ({
  text,
  toggle,
  action,
  type,
  onDelete,
}) => {
  return (
    <>
      <div className="flex justify-start items-start space-x-2 mb-2">
        <Image
          width={40}
          height={40}
          src={emptyAvatar}
          alt="Avatar"
          className="rounded-full h-[40px] w-[40px]"
          priority
        />
        <div>
          <div className="bg-gray-100 rounded-2xl px-2 py-1 relative min-w-[200px]">
            <h1 className="text-md font-bold space-y-3">Le Minh Tuong</h1>
            <Expandable text={text} maxCharacters={20} />
          </div>
          <div className="mt-1 flex justify-between items-center">
            <div className="flex items-center space-x-4 px-2">
              <p className="text-xs">11/03/2024</p>
              <p className="text-xs font-bold hover:text-rose-500 cursor-pointer">
                Like
              </p>
              {type === 1 && (
                <p
                  className={`text-xs font-bold hover:text-rose-500 cursor-pointer ${
                    toggle && "text-rose-500 "
                  }`}
                  onClick={action}
                >
                  Reply
                </p>
              )}
            </div>
            <p
              className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
              onClick={onDelete}
            >
              Remove
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPostReviewItem;
