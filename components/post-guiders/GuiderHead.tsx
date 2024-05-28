"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineShareAlt } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdConnectedTv } from "react-icons/md";
import { FaCopy, FaStar } from "react-icons/fa";
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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { PostGuiderLocation } from "@/models/post";
import { getPostGuiderTypeName } from "@/utils/getPostGuiderType";

interface GuiderHeadProps {
  title: string;
  locationValue: PostGuiderLocation;
  imageSrc: string;
  id: number;
  isFree: boolean;
  topicId: number;
  locationAddress: string;
}

const GuiderHead: React.FC<GuiderHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  isFree,
  topicId,
  locationAddress,
}) => {
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
      setIsShowShareOptions((prev) => !prev);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success(t('toast.copy-successfully'));
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
    <>
      <div className="flex items-center space-x-2 mb-2 font-bold text-md">
        <MdConnectedTv size={18} />
        <span className="text-sm">
          {t(`post-guider-types.${getPostGuiderTypeName(topicId)}`)}
        </span>
      </div>
      <div className="flex justify-between items-end mb-1">
        <Heading title={title} isGuider={true} />
      </div>
      <div className="flex justify-between items-end mb-8">
        <div className="flex justify-between items-end gap-6">
          <div className="flex space-x-1 justify-between items-center">
            <FaStar size={14} />
            <span className="text-sm font-semibold">{5.0} </span>
            <span className="text-sm">(16)</span>
          </div>
          <span className="underline font-bold text-sm">
            {`${locationAddress ? locationAddress + ", " : ""}${
              locationValue.district ? locationValue.district + ", " : ""
            }${locationValue.state ? locationValue.state + ", " : ""}${
              locationValue.country ? locationValue.country : ""
            }`}
          </span>
        </div>
        <div className="flex justify-between items-end gap-6">
          <div
            className="flex items-center justify-between cursor-pointer relative"
            onClick={scrollToShareOptionsSection}
            ref={shareOptionsSection}
          >
            <AiOutlineShareAlt />
            <span className="text-[16px] ml-2 underline">{t('components.share')}</span>
            <div
              ref={shareOptionsPickerSection}
              className={`${
                !isShowShareOptions
                  ? "hidden"
                  : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
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
                  {t('components.copy-link')}
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
          {/* {loggedUser?.role !== Role.Admin && (
            <div className="">
              <HeartButton listingId={id} isFree={isFree} />
            </div>
          )} */}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-6 w-full h-[60vh] overflow-hidden rounded-xl relative"
        >
          <Image
            src={imageSrc}
            alt="image"
            fill
            className="object-cover w-full"
          />
          <div className="row-span-1">
            <div className="grid grid-cols-12 gap-8 w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
                <div className="absolute top-5 right-5">
                  <HeartButton listingId={id} isFree={isFree} />
                </div>
              </motion.div>
            </div>
            <div className="grid grid-cols-12 gap-8 w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="col-span-6 h-[60vh]">
          <div className="grid grid-rows-2 h-[60vh] gap-4">
            <div className="row-span-1">
              <div className="grid grid-cols-12 gap-4 w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
              </div>
            </div>
            <div className="row-span-1">
              <div className="grid grid-cols-12 gap-4 w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuiderHead;
