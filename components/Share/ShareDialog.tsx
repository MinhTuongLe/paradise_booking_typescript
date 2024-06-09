"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
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
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { AiOutlineShareAlt } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";

import i18n from "@/i18n/i18n";
import { chatBotAvatar, emptyAvatar } from "@/const";

const ShareDialog = ({ className }: { className?: string }) => {
  const currentUrl = window.location.href;
  const { t } = useTranslation("translation", { i18n });

  const [isShowShareOptions, setIsShowShareOptions] = useState(false);
  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);

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
      setIsShowShareOptions((prev: boolean) => !prev);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success(t("toast.copy-successfully"));
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

  return (
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
            : `absolute grid grid-cols-2 space-x-4 px-6 py-5 ${
                className ?? "top-[110%] right-0"
              }  z-10 w-[30vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]`
        }`}
      >
        <div className="col-span-1 space-y-4">
          <div
            className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
            onClick={handleCopyToClipboard}
          >
            <FaCopy size={30} style={{ color: "#05a569", marginRight: 16 }} />
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
  );
};

export default ShareDialog;
