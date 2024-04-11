/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaCheckCircle,
  FaComment,
  FaCopy,
  FaHeart,
  FaRegCommentDots,
  FaStar,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdClose, IoMdSend } from "react-icons/io";
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

import Button from "@/components/Button";
import "../../../styles/globals.css";
import { API_URL, booking_status, emptyAvatar, emptyImage } from "@/const";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import Expandable from "@/components/Expandable";
import CommentPostReview from "@/components/CommentPostReview";
import useLoginModal from "@/hook/useLoginModal";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const PostReviewClient: React.FC<any> = () => {
  const text = `VŨ KHÍ GAMING TỐI THƯỢNG PREDATOR HELIOS NEO 16 2024: THIẾT KẾ HOÀN TOÀN MỚI - CORE I9 GEN 14 & RTX 4070<br /><br />
  🌟 Predator Helios Neo 16 2024 PNH16-72 chính là phiên bản hoàn toàn mới của dòng Laptop Gaming bán chạy nhất Việt Nam ở phân khúc cao cấp với mức giá từ 50 đến 60 triệu đồng.<br /><br />
  Với phiên bản 2024 này, Helios Neo 16 được nâng cấp đầy ấn tượng cả về cấu hình lẫn thiết kế:<br />
  ✅ Thiết kế hoàn toàn mới với dãy mật mã bí ẩn cùng logo Predator cách điệu cực chất<br />
  ✅ Màn hình 16″ IPS 2K+ (WQXGA - 2560×1600) 240Hz, DCI-P3 100%, 500 nits hoàn hảo cho mọi nhu cầu<br />
  ✅ CPU Intel® Core™ i9-14900HX (i7-14700HX) cực khủng<br />
  ✅ GPU NVIDIA® GeForce RTX™ 4070 8GB chuẩn meta<br />
  ✅ RAM 16GB DDR5 5600MHz, ổ cứng 1TB SED SSD<br />
  ✅ Quạt AeroBlade 3D thế hệ 5, ống đồng dạng Vector và keo tản nhiệt Kim Loại Lỏng đem đến hiệu năng làm mát hàng đầu phân khúc<br /><br />
  Giải mã mọi giới hạn, khám phá khát khao tiềm ẩn và phát huy nội lực vô tận cùng Predator Helios Neo 16 2024 PHN16-72: http://bit.ly/PREDATOR_HELIOS_NEO_16<br /><br />
  #Acer #PredatorGaming #predator #HeliosNeo16<br /><br />
  ----------<br />
  FOLLOW Acer Việt Nam<br />
  ► ZALO: https://bit.ly/Zalo_Acer<br />
  ► INSTAGRAM: https://bit.ly/instagram_Acer_Vietnam<br />
  ► YOUTUBE: https://bit.ly/Youtube_Acer_Vietnam`;

  // const dispatch = useDispatch();
  const router = useRouter();
  const loginModal = useLoginModal();
  const authState = useSelector((state: RootState) => state.authSlice.authState);


  const [isShowShareOptions, setIsShowShareOptions] = useState(false);
  const [commentData, setCommentData] = useState<
    { comment: string; child: string[] }[]
  >([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const currentUrl = window.location.href;

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
    toast.success("Copy successfully");
  };

  // const loggedUser = useSelector(
  //   (state: RootState) => state.authSlice.loggedUser
  // );
  // const authState = useSelector(
  //   (state: RootState) => state.authSlice.authState
  // );

  // const [isLoading, setIsLoading] = useState(false);
  // const [hover, setHover] = useState(rating?.rating || null);

  // // console.log(rating);

  // const {
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     rating: rating?.rating || 0,
  //     content: rating?.content || "",
  //     title: rating?.title || "",
  //   },
  // });

  // const setCustomValue = (id: any, value: number | string) => {
  //   setValue(id, value, {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  // };

  // const handleSend = async (data: RatingDataSubmit) => {
  //   try {
  //     setIsLoading(true);

  //     const submitValues = {
  //       ...data,
  //       place_id: reservation?.data.place.id,
  //       booking_id: reservation?.data.id,
  //     };
  //     // console.log(submitValues);

  //     const accessToken = Cookie.get("accessToken");
  //     const config = {
  //       headers: {
  //         "content-type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     };
  //     axios
  //       .post(`${API_URL}/booking_ratings`, submitValues, config)
  //       .then(() => {
  //         setIsLoading(false);
  //         toast.success("Comment Successfully");
  //         router.refresh();
  //       })
  //       .catch((err) => {
  //         toast.error("Comment Failed");
  //         setIsLoading(false);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // if (
  //   reservation?.user_id !== 0 &&
  //   (!authState || loggedUser?.id !== reservation?.user_id)
  // ) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }
  const handleClearComment = () => {
    if (deleteIndex !== null) {
      let currentCommentData = [...commentData];
      currentCommentData.splice(deleteIndex, 1);

      setCommentData(currentCommentData);
      setOpen(false);
      toast.success("Delete comment successfully");
    }
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
    <div className="mx-auto">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content="comment"
      />
      <div className="grid grid-cols-3">
        <div className="col-span-2 bg-transparent pt-6">
          <Image
            src={
              "https://a0.muscache.com/im/pictures/e35bb307-05f4-48a4-bdc5-3b2198bb9451.jpg?im_w=1440" ||
              emptyImage
            }
            alt="listing"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto max-h-[70vh]"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          className="px-4 py-6 relative max-h-[80vh] overflow-y-scroll vendor-room-listing"
          style={{ overflowX: "hidden" }}
        >
          <div className="flex justify-between items-center ">
            <div className="flex justify-start items-center space-x-4">
              <Image
                width={60}
                height={60}
                src={emptyAvatar}
                alt="Avatar"
                className="rounded-full h-[40px] w-[40px] cursor-pointer"
                priority
                onClick={() => router.push("/users/5")}
              />
              <div>
                <h1
                  className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                  onClick={() => router.push("/users/5")}
                >
                  Le Minh Tuong
                </h1>
                <p className="text-sm">11/03/2024</p>
              </div>
            </div>
            <BsThreeDots size={24} />
          </div>
          <div className=" flex flex-col pt-2 max-h-[70vh] overflow-y-scroll pb-4 overflow-x-hidden vendor-room-listing">
            <Expandable text={text} maxCharacters={100} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-2">
              <AiFillLike size={24} />
              <span>23</span>
            </div>
            <div className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-2">
              <span>23</span>
              <FaComment size={20} />
            </div>
          </div>
          <div className="flex justify-between items-center px-3 py-2 mt-2 mb-2 border-t-gray-300 border-t-[1px] border-b-gray-300 border-b-[1px]">
            <div className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1">
              <AiOutlineLike size={24} />
              <span>Like</span>
            </div>
            <div
              className="flex items-center justify-between cursor-pointer relative"
              onClick={scrollToShareOptionsSection}
              ref={shareOptionsSection}
            >
              <AiOutlineShareAlt />
              <span className="text-[16px] ml-2 underline">Share</span>
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
                    Copy link
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
            {/* {commentData.map(
              (
                comment: { comment: string; child: string[] },
                index: number
              ) => (
                <div key={index}>
                  <CommentPostReview
                    text={comment.comment}
                    deleteComment={() => {
                      setDeleteIndex(index);
                      setOpen(true);
                    }}
                    child={comment.child}
                    appendChild={(data: string) => {
                      setCommentData((prev) => {
                        const newData = [...prev];
                        newData[index] = {
                          ...newData[index],
                          child: [...newData[index].child, data],
                        };
                        return newData;
                      });
                    }}
                    removeChild={(childIndex: number) => {
                      setCommentData((prev) => {
                        const newData = [...prev];
                        newData[index] = {
                          ...newData[index],
                          child: newData[index].child.filter(
                            (_, i) => i !== childIndex
                          ),
                        };
                        return newData;
                      });
                    }}
                  />
                </div>
              )
            )} */}
          </div>

          <div className="flex items-center space-x-2 relative">
            <Image
              width={60}
              height={60}
              src={emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px]"
              priority
            />
            <textarea
              onChange={(e) => setCommentContent(e.target.value)}
              value={commentContent}
              className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
              rows={1}
              placeholder="Give your comment ..."
            ></textarea>
            <div
              className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
              onClick={() => {
                if (!commentContent || commentContent === "") {
                  toast.error("Comment is not blank");
                  return;
                }
                setCommentData((prev) => [
                  ...prev,
                  {
                    comment: commentContent,
                    child: [],
                  },
                ]);
                setCommentContent("");
                toast.success("Comment successfully");
              }}
            >
              <IoMdSend size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReviewClient;
