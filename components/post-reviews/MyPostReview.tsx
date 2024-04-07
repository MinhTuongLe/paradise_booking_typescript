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
import { MdEdit, MdPending } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
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
import "../../styles/globals.css";
import {
  API_URL,
  booking_status,
  emptyAvatar,
  emptyImage,
  formatDateTimeType,
} from "@/const";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import usePostReviewModal from "@/hook/usePostReviewModal";
import Expandable from "../Expandable";
import {
  CommentPostReviewType,
  LikePostReviewType,
  PostReview,
} from "@/models/post";
import dayjs from "dayjs";
import { FaLocationDot } from "react-icons/fa6";
import { User } from "@/models/user";
import { getUserName } from "@/utils/getUserInfo";
import Cookies from "js-cookie";
import CommentPostReview from "../CommentPostReview";

export interface MyPostReviewProps {
  data: PostReview;
  owner: User | null;
  onDelete: (id: number) => void;
}

const MyPostReview: React.FC<MyPostReviewProps> = ({
  data,
  owner,
  onDelete,
}) => {
  // const dispatch = useDispatch();
  const router = useRouter();
  const postReviewModal = usePostReviewModal();
  const [isShowShareOptions, setIsShowShareOptions] = useState(false);
  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);
  const commentParentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuParentRef = useRef<HTMLDivElement>(null);

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedComment, setIsExpandedComment] = useState<number[]>([]);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [openModalDeletePost, setOpenModalDeletePost] = useState(false);
  const [commentData, setCommentData] = useState<
    { comment: string; child: string[] }[]
  >([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLike, setIsLike] = useState(2);

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

  const handleLikePost = async () => {
    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");
    const userId = Cookies.get("userId");

    const submitValues: LikePostReviewType = {
      account_id: Number(userId),
      post_review_id: data.id,
      type: isLike === 1 ? 2 : 1,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .post(`${API_URL}/like_post_reviews`, submitValues, config)
      .then(() => {
        toast.success(`${isLike ? "Like" : "Unlike"} Successfully`);
        setIsLike(isLike === 1 ? 2 : 1);
        router.refresh();
      })
      .catch((err) => {
        toast.error(`${isLike ? "Like" : "Unlike"} Failed`);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSendComment = async () => {
    if (!commentContent || commentContent === "") {
      toast.error("Comment is not blank");
      return;
    }

    setIsLoading(true);
    const accessToken = Cookies.get("accessToken");
    const userId = Cookies.get("userId");

    const submitValues: CommentPostReviewType = {
      account_id: Number(userId),
      post_review_id: data.id,
      comment: commentContent,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .post(`${API_URL}/post_review/comment`, submitValues, config)
      .then(() => {
        toast.success("Comment Successfully");
        setCommentData((prev) => [
                ...prev,
                {
                  comment: commentContent,
                  child: [],
                },
              ]);
        setCommentContent("");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Comment Failed");
      })
      .finally(() => setIsLoading(false));
  };

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

  const handleDelete = async () => {
    onDelete(data.id);
    setOpenModalDeletePost(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuParentRef.current &&
        !menuParentRef.current.contains(event.target as Node)
      ) {
        setIsShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, menuParentRef]);

  return (
    <div className="mx-auto">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleClearComment}
        content="comment"
      />
      <ConfirmDeleteModal
        isOpen={openModalDeletePost}
        onClose={() => setOpenModalDeletePost(false)}
        onDelete={handleDelete}
        content="post review"
      />
      <div
        className="px-4 py-6 relative overflow-y-scroll vendor-room-listing"
        style={{ overflowX: "hidden" }}
        ref={commentParentRef}
      >
        <div className="flex justify-between items-center ">
          <div className="flex justify-start items-center space-x-4 mb-2">
            <Image
              width={60}
              height={60}
              src={emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] cursor-pointer"
              priority
              onClick={() => router.push(`/users/${owner?.id}`)}
            />
            <div>
              <h1
                className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                onClick={() => router.push(`/users/${owner?.id}`)}
              >
                {owner ? getUserName(owner) : "User"}
              </h1>
              <p className="text-sm">
                {dayjs(data.created_at).format(formatDateTimeType.DMY_HMS)}
              </p>
            </div>
          </div>
          <div
            ref={menuRef}
            className="relative cursor-pointer"
            onClick={() => setIsShowMenu((pre) => !pre)}
          >
            <BsThreeDots size={24} />
            {isShowMenu && (
              <div
                className={`absolute right-0 top-[100%] w-[300px] bg-white rounded-xl overflow-hidden shadow-lg shadow-slate-400 border-[1px] border-slate-200`}
                ref={menuParentRef}
              >
                <div
                  className="bg-white px-4 py-3 flex justify-start gap-3 items-center border-b-[1px] border-b-slate-200"
                  onClick={() => {
                    postReviewModal.onOpen({ data: data.id, isEdit: true });
                  }}
                >
                  <MdEdit size={24} />
                  <span className="text-lg">Edit this post</span>
                </div>
                <div
                  className="bg-white px-4 py-3 flex justify-start gap-3 items-center"
                  onClick={() => setOpenModalDeletePost(true)}
                >
                  <RiDeleteBin5Line size={24} />
                  <span className="text-lg">Delete this post</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {data.image && (
          <Image
            src={data.image}
            alt="listing"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto max-h-[70vh] mb-4 cursor-pointer"
            style={{ objectFit: "contain" }}
            onClick={() => router.push(`/post-reviews/${data.id}`)}
          />
        )}
        <div className="text-lg font-bold flex flex-col pt-2 max-h-[70vh] overflow-y-scroll pb-0 overflow-x-hidden vendor-room-listing">
          <Expandable text={data.title} maxCharacters={100} />
        </div>
        <div className=" flex flex-col max-h-[70vh] overflow-y-scroll pb-6 overflow-x-hidden vendor-room-listing">
          <Expandable text={data.content} maxCharacters={100} />
        </div>
        <div className="flex items-center mb-2">
          <FaLocationDot size={16} className="text-sky-400" />
          <div className="ml-2 font-thin text-sm text-slate-500">
            At HCM City
          </div>
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
          <div
            className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
            onClick={handleLikePost}
          >
            {isLike === 1 ? (
              <AiFillLike size={24} />
            ) : (
              <AiOutlineLike size={24} />
            )}
            <span>Like</span>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
            onClick={scrollToCommentSection}
          >
            <FaRegCommentDots size={20} />
            <span>Comment</span>
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
                  : "absolute grid grid-cols-2 space-x-4 px-6 py-5 bottom-0 right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
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
          {commentData.map(
            (comment: { comment: string; child: string[] }, index: number) => (
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
          )}
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
              // if (!commentContent || commentContent === "") {
              //   toast.error("Comment is not blank");
              //   return;
              // }
              // setCommentData((prev) => [
              //   ...prev,
              //   {
              //     comment: commentContent,
              //     child: [],
              //   },
              // ]);
              // setCommentContent("");
              // toast.success("Comment successfully");
              handleSendComment();
            }}
          >
            <IoMdSend size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostReview;
