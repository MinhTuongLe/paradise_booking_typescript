import { emptyAvatar, formatDateType } from "@/const";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Cookie from "js-cookie";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import i18n from "@/i18n/i18n";
import Expandable from "./Expandable";
import { CommentType, ReportTypes } from "@/enum";
import { getOwnerName } from "@/utils/getUserInfo";
import { CommentPostReviewItemType, PostOwnerType } from "@/models/post";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useReportModal from "@/hook/useReportModal";
import { BsThreeDots } from "react-icons/bs";

interface CommentPostReviewItemProps {
  toggle?: boolean;
  action?: () => void;
  type: CommentType;
  onDelete?: () => void;
  data: CommentPostReviewItemType;
}

const CommentPostReviewItem: React.FC<CommentPostReviewItemProps> = ({
  data,
  toggle,
  action,
  type,
  onDelete,
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
              <Expandable text={data.content} maxCharacters={15} />
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
                      : "absolute space-y-5 px-5 py-4 top-[110%] left-0 z-10 w-40 bg-white shadow-xl rounded-lg border-[1px] border-[#f2f2f2]"
                  }`}
                >
                  {loggedUser?.email !== data.owner.email && (
                    <p
                      className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
                      onClick={() =>
                        reportModal.onOpen({
                          type: ReportTypes.PostReviewComment,
                        })
                      }
                    >
                      {t("components.report")}
                    </p>
                  )}
                  {loggedUser?.email === data.owner.email && (
                    <p
                      className="text-xs font-bold hover:text-rose-500 cursor-pointer pr-2"
                      onClick={onDelete}
                    >
                      {t("general.update")}
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
