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
import {
  API_URL,
  booking_status,
  emptyAvatar,
  emptyImage,
  text_comment_max_length,
  text_max_length,
} from "@/const";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const PostReviewClient: React.FC<any> = () => {
  // const dispatch = useDispatch();
  const router = useRouter();
  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedComment, setIsExpandedComment] = useState<number[]>([]);
  const [isExpandedAllComments, setIsExpandedAllComments] = useState<number[]>(
    []
  );
  const [repComments, setRepComments] = useState<
    { key: number; value: string[] }[]
  >([]);
  const [isShowRepComment, setIsShowRepComment] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [commentId, setCommentId] = useState<number | null>(null);

  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);
  const commentParentRef = useRef<HTMLDivElement>(null);

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
  const currentUrl = window.location.href;
  const words = text.split(" ");
  const truncatedText = isExpanded
    ? text
    : words.slice(0, text_max_length).join(" ");

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
      setIsShowDateRange((prev) => !prev);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Copy successfully");
  };

  const handleSendComment = (commentId: number) => {
    // console.log("commentContent: ", commentContent);
    // console.log("commentId: ", commentId);

    let updatedComments = [...repComments];

    let found = false;

    for (let i = 0; i < updatedComments.length; i++) {
      if (updatedComments[i].key === commentId) {
        found = true;
        updatedComments[i].value.push(commentContent);
        break;
      }
    }

    if (!found) {
      updatedComments.push({ key: commentId, value: [commentContent] });
    }
    setRepComments(updatedComments);
    setIsShowRepComment(0);
    setCommentContent("");
    if (!isExpandedAllComments.includes(commentId))
      setIsExpandedAllComments((prev) =>
        prev.filter((item) => item !== commentId)
      );
  };

  const handleClearComment = () => {
    console.log("deleteIndex: ", deleteIndex);
    if (deleteIndex !== null) {
      const foundObjIndex = repComments.findIndex(
        (comment) => comment.key === commentId
      );

      if (foundObjIndex === -1) {
        return;
      }

      const updatedValues = [...repComments[foundObjIndex].value];
      updatedValues.splice(deleteIndex, 1);
      const updatedRepComments = [...repComments];
      updatedRepComments[foundObjIndex].value = updatedValues;
      setRepComments(updatedRepComments);
      setOpen(false);
    }
  };

  const toggleExpandAllComments = (index: number) => {
    console.log("index: ", index);
    console.log(isExpandedAllComments.includes(index));
    if (isExpandedAllComments.includes(index))
      setIsExpandedAllComments((prev) => prev.filter((item) => item !== index));
    else setIsExpandedAllComments((prev) => [...prev, index]);
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExpandComment = (index: number) => {
    if (isExpandedComment.includes(index))
      setIsExpandedComment((prev) => prev.filter((item) => item !== index));
    else setIsExpandedComment((prev) => [...prev, index]);
  };

  const scrollToCommentSection = () => {
    if (commentParentRef.current) {
      const container = commentParentRef.current;
      const lastChild = container.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }
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
        setIsShowDateRange(false);
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
          ref={commentParentRef}
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
            <p
              className={` ${
                isExpanded
                  ? "whitespace-normal overflow-visible"
                  : "overflow-hidden"
              }`}
              dangerouslySetInnerHTML={{
                __html: isExpanded ? text : truncatedText,
              }}
              style={{ WebkitLineClamp: isExpanded ? "none" : "5" }}
            ></p>
            {words.length > text_max_length && (
              <button
                onClick={toggleExpand}
                className="text-left text-rose-500 font-bold"
              >
                {isExpanded ? "Hide" : "Read more"}
              </button>
            )}
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
                  !isShowDateRange
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
                      title={"Paradise Booking App"}
                      url={currentUrl}
                      hashtags={["ParadiseBookingApp", "Paradise"]}
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
                      title="Paradise Booking App"
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
                      title="Paradise Booking App"
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
                      title="Paradise Booking App"
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
                <div className="bg-gray-100 rounded-2xl px-2 py-1 relative">
                  <h1 className="text-md font-bold space-y-3">Le Minh Tuong</h1>
                  <p
                    className={`text-sm ${
                      isExpandedComment.includes(1)
                        ? "whitespace-normal overflow-visible"
                        : "overflow-hidden"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: isExpandedComment.includes(1)
                        ? text
                        : words.slice(0, text_comment_max_length).join(" "),
                    }}
                    style={{
                      WebkitLineClamp: isExpandedComment.includes(1)
                        ? "none"
                        : "5",
                    }}
                  ></p>
                  {words.length > text_comment_max_length && (
                    <button
                      onClick={() => toggleExpandComment(1)}
                      className="text-left text-rose-500 font-bold"
                    >
                      {isExpandedComment.includes(1) ? "Hide" : "Read more"}
                    </button>
                  )}
                  <div className="absolute right-0 top-[60%] translate-x-[60%]">
                    <FaHeart size={16} className="text-rose-500" />
                  </div>
                </div>
                <div className="mt-1 flex items-center space-x-4 px-2">
                  <p className="text-xs">11/03/2024</p>
                  <p className="text-xs font-bold hover:text-rose-500 cursor-pointer">
                    Like
                  </p>
                  <p
                    className={`text-xs font-bold hover:text-rose-500 cursor-pointer ${
                      isShowRepComment === 1 && "text-rose-500 "
                    }`}
                    onClick={() => {
                      setIsShowRepComment((prev) => {
                        if (prev === 1) {
                          return null;
                        } else {
                          return 1;
                        }
                      });
                      setCommentContent("");
                    }}
                  >
                    Reply
                  </p>
                </div>
                {(repComments.find((comment) => comment.key === 1)?.value
                  ?.length as number) > 0 && (
                  <div
                    className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
                    onClick={() => toggleExpandAllComments(1)}
                  >
                    {!isExpandedAllComments.includes(1)
                      ? "Show all comments"
                      : "Hide all comments"}
                  </div>
                )}
                {isExpandedAllComments.includes(1) &&
                  repComments
                    .find((comment) => comment.key === 1)
                    ?.value?.map((content: string, index: number) => (
                      <div
                        className="flex items-center space-x-2 relative mt-3"
                        key={index}
                      >
                        <Image
                          width={60}
                          height={60}
                          src={emptyAvatar}
                          alt="Avatar"
                          className="rounded-full h-[40px] w-[40px]"
                          priority
                        />
                        <textarea
                          value={content}
                          className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                          rows={1}
                          disabled
                        ></textarea>
                        <div
                          onClick={() => {
                            setOpen(true);
                            setDeleteIndex(index);
                            setCommentId(1);
                          }}
                          className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                        >
                          <IoMdClose size={24} />
                        </div>
                      </div>
                    ))}
                {isShowRepComment === 1 && (
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
                      onClick={() => handleSendComment(1)}
                      className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                    >
                      <IoMdSend size={24} />
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                <div className="bg-gray-100 rounded-2xl px-2 py-1 relative">
                  <h1 className="text-md font-bold space-y-3">Le Minh Tuong</h1>
                  <p
                    className={`text-sm ${
                      isExpandedComment.includes(2)
                        ? "whitespace-normal overflow-visible"
                        : "overflow-hidden"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: isExpandedComment.includes(2)
                        ? text
                        : words.slice(0, text_comment_max_length).join(" "),
                    }}
                    style={{
                      WebkitLineClamp: isExpandedComment.includes(2)
                        ? "none"
                        : "5",
                    }}
                  ></p>
                  {words.length > text_comment_max_length && (
                    <button
                      onClick={() => toggleExpandComment(2)}
                      className="text-left text-rose-500 font-bold"
                    >
                      {isExpandedComment.includes(2) ? "Hide" : "Read more"}
                    </button>
                  )}
                  <div className="absolute right-0 top-[60%] translate-x-[60%]">
                    <FaHeart size={16} className="text-rose-500" />
                  </div>
                </div>
                <div className="mt-1 flex items-center space-x-4 px-2">
                  <p className="text-xs">11/03/2024</p>
                  <p className="text-xs font-bold hover:text-rose-500 cursor-pointer">
                    Like
                  </p>
                  <p
                    className={`text-xs font-bold hover:text-rose-500 cursor-pointer ${
                      isShowRepComment === 2 && "text-rose-500 "
                    }`}
                    onClick={() => {
                      setIsShowRepComment((prev) => {
                        if (prev === 2) {
                          return null;
                        } else {
                          return 2;
                        }
                      });
                      setCommentContent("");
                    }}
                  >
                    Reply
                  </p>
                </div>
                {(repComments.find((comment) => comment.key === 2)?.value
                  ?.length as number) > 0 && (
                  <div
                    className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
                    onClick={() => toggleExpandAllComments(2)}
                  >
                    {!isExpandedAllComments.includes(2)
                      ? "Show all comments"
                      : "Hide all comments"}
                  </div>
                )}
                {isExpandedAllComments.includes(2) &&
                  repComments
                    .find((comment) => comment.key === 2)
                    ?.value?.map((content: string, index: number) => (
                      <div
                        className="flex items-center space-x-2 relative mt-3"
                        key={index}
                      >
                        <Image
                          width={60}
                          height={60}
                          src={emptyAvatar}
                          alt="Avatar"
                          className="rounded-full h-[40px] w-[40px]"
                          priority
                        />
                        <textarea
                          value={content}
                          className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                          rows={1}
                          disabled
                        ></textarea>
                        <div
                          onClick={() => {
                            setOpen(true);
                            setDeleteIndex(index);
                            setCommentId(2);
                          }}
                          className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                        >
                          <IoMdClose size={24} />
                        </div>
                      </div>
                    ))}
                {isShowRepComment === 2 && (
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
                      onClick={() => handleSendComment(2)}
                      className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                    >
                      <IoMdSend size={24} />
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                <div className="bg-gray-100 rounded-2xl px-2 py-1 relative">
                  <h1 className="text-md font-bold space-y-3">Le Minh Tuong</h1>
                  <p
                    className={`text-sm ${
                      isExpandedComment.includes(3)
                        ? "whitespace-normal overflow-visible"
                        : "overflow-hidden"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: isExpandedComment.includes(3)
                        ? text
                        : words.slice(0, text_comment_max_length).join(" "),
                    }}
                    style={{
                      WebkitLineClamp: isExpandedComment.includes(3)
                        ? "none"
                        : "5",
                    }}
                  ></p>
                  {words.length > text_comment_max_length && (
                    <button
                      onClick={() => toggleExpandComment(3)}
                      className="text-left text-rose-500 font-bold"
                    >
                      {isExpandedComment.includes(3) ? "Hide" : "Read more"}
                    </button>
                  )}
                  <div className="absolute right-0 top-[60%] translate-x-[60%]">
                    <FaHeart size={16} className="text-rose-500" />
                  </div>
                </div>
                <div className="mt-1 flex items-center space-x-4 px-2">
                  <p className="text-xs">11/03/2024</p>
                  <p className="text-xs font-bold hover:text-rose-500 cursor-pointer">
                    Like
                  </p>
                  <p
                    className={`text-xs font-bold hover:text-rose-500 cursor-pointer ${
                      isShowRepComment === 3 && "text-rose-500 "
                    }`}
                    onClick={() => {
                      setIsShowRepComment((prev) => {
                        if (prev === 3) {
                          return null;
                        } else {
                          return 3;
                        }
                      });
                      setCommentContent("");
                    }}
                  >
                    Reply
                  </p>
                </div>
                {(repComments.find((comment) => comment.key === 3)?.value
                  ?.length as number) > 0 && (
                  <div
                    className="cursor-pointer text-sm font-bold mt-1 hover:underline hover:text-rose-500"
                    onClick={() => toggleExpandAllComments(3)}
                  >
                    {!isExpandedAllComments.includes(3)
                      ? "Show all comments"
                      : "Hide all comments"}
                  </div>
                )}
                {isExpandedAllComments.includes(3) &&
                  repComments
                    .find((comment) => comment.key === 3)
                    ?.value?.map((content: string, index: number) => (
                      <div
                        className="flex items-center space-x-2 relative mt-3"
                        key={index}
                      >
                        <Image
                          width={60}
                          height={60}
                          src={emptyAvatar}
                          alt="Avatar"
                          className="rounded-full h-[40px] w-[40px]"
                          priority
                        />
                        <textarea
                          value={content}
                          className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                          rows={1}
                          disabled
                        ></textarea>
                        <div
                          onClick={() => {
                            setOpen(true);
                            setDeleteIndex(index);
                            setCommentId(3);
                          }}
                          className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                        >
                          <IoMdClose size={24} />
                        </div>
                      </div>
                    ))}
                {isShowRepComment === 3 && (
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
                      onClick={() => handleSendComment(3)}
                      className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer"
                    >
                      <IoMdSend size={24} />
                    </div>
                  </div>
                )}
              </div>
            </div>
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
              className="resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
              rows={1}
              placeholder="Give your comment ..."
            ></textarea>
            <div className="absolute right-4 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer">
              <IoMdSend size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReviewClient;
