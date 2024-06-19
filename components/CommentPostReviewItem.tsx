import { emptyAvatar, formatDateType } from "@/const";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Cookie from "js-cookie";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import i18n from "@/i18n/i18n";
import Expandable from "./Expandable";
import { CommentType, ReportTypes } from "@/enum";
import { getOwnerName } from "@/utils/getUserInfo";
import { CommentPostReviewItemType, PostOwnerType } from "@/models/post";
import { RootState } from "@/store/store";
import useReportModal from "@/hook/useReportModal";

interface CommentPostReviewItemProps {
  toggle?: boolean;
  action?: () => void;
  type: CommentType;
  onDelete?: () => void;
  onUpdate?: (index: number, content: string) => void;
  data: CommentPostReviewItemType;
}

const CommentPostReviewItem: React.FC<CommentPostReviewItemProps> = ({
  data,
  toggle,
  action,
  type,
  onDelete,
  onUpdate,
}) => {
  const router = useRouter();
  const { t } = useTranslation("translation", { i18n });
  const accessToken = Cookie.get("accessToken");
  const reportModal = useReportModal();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const commentOptionsSection = useRef<HTMLDivElement>(null);
  const commentOptionsPickerSection = useRef<HTMLDivElement>(null);

  const [isShowCommentOptions, setIsShowCommentOptions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initContent, setInitContent] = useState(data.content || "");

  const scrollToCommentOptionsSection = () => {
    if (commentOptionsSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        commentOptionsSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowCommentOptions((prev) => !prev);
    }
  };

  const handleEditComment = () => {
    if (!isEditMode) setIsEditMode(true);
    else {
      // Update new comment
      if (data?.id && onUpdate) {
        if (!initContent || initContent === "") {
          toast.error(t("toast.comment-is-not-blank"));
          return;
        }
        onUpdate(data.id, initContent);
        setIsEditMode(false);
      }
    }
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setInitContent(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentOptionsSection.current &&
        !commentOptionsSection.current.contains(event.target as Node) &&
        commentOptionsPickerSection.current &&
        !commentOptionsPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowCommentOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentOptionsSection, commentOptionsPickerSection]);

  return (
    <>
      <div className="flex justify-start items-start space-x-2 mb-2">
        <Image
          width={40}
          height={40}
          src={data?.owner.avatar || emptyAvatar}
          alt="Avatar"
          className="rounded-full h-[40px] w-[40px] cursor-pointer"
          priority
          onClick={() => router.push(`/users/${data?.account_id}`)}
        />
        <div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-2xl px-2 py-1 relative min-w-[200px]">
              <h1
                className="text-md font-bold space-y-3 cursor-pointer hover:text-rose-500"
                onClick={() => router.push(`/users/${data?.account_id}`)}
              >
                {getOwnerName(data.owner)}
              </h1>
              {isEditMode ? (
                <textarea
                  id="schedule"
                  className={`resize-none w-auto focus:outline-none bg-gray-100`}
                  value={initContent}
                  onInput={handleTextareaInput}
                  onChange={handleTextareaInput}
                  rows={3}
                  placeholder={t("components.give-your-comment")}
                ></textarea>
              ) : (
                <Expandable text={initContent} maxCharacters={15} />
              )}
            </div>
            {accessToken && (
              <div
                className="flex items-center justify-between cursor-pointer relative"
                onClick={scrollToCommentOptionsSection}
                ref={commentOptionsSection}
              >
                <div className="flex items-center space-x-2 hover:text-rose-500 hover:underline">
                  <BsThreeDots />
                </div>
                <div
                  ref={commentOptionsPickerSection}
                  className={`${
                    !isShowCommentOptions
                      ? "hidden"
                      : "absolute space-y-5 px-5 py-4 top-[110%] right-0 z-10 w-40 bg-white shadow-xl rounded-lg border-[1px] border-[#f2f2f2]"
                  }`}
                >
                  {loggedUser?.email !== data.owner.email && (
                    <p
                      className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
                      onClick={() =>
                        reportModal.onOpen({
                          type: ReportTypes.Comment,
                          object_id: data.id,
                        })
                      }
                    >
                      {t("components.report")}
                    </p>
                  )}
                  {loggedUser?.email === data.owner.email && (
                    <p
                      className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
                      onClick={handleEditComment}
                    >
                      {t(`general.${isEditMode ? "save" : "update"}`)}
                    </p>
                  )}
                  {loggedUser?.email === data.owner.email && (
                    <p
                      className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
                      onClick={onDelete}
                    >
                      {t("components.remove")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-1 flex items-center space-x-6">
            <div className="flex items-center space-x-4 px-2">
              <p className="text-xs">
                {dayjs(data?.date_comment).format(formatDateType.DMY)}
              </p>
              {type === CommentType.Parent && (
                <p
                  className={`text-xs font-bold hover:text-rose-500 cursor-pointer ${
                    toggle && "text-rose-500 "
                  }`}
                  onClick={action}
                >
                  {t("components.reply")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPostReviewItem;
