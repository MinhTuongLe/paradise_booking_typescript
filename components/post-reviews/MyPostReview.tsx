/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import "../../styles/globals.css";
import {
  API_URL,
  booking_status,
  emptyAvatar,
  emptyImage,
  text_comment_max_length,
  text_max_length,
} from "@/const";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaCheckCircle,
  FaComment,
  FaHeart,
  FaRegCommentDots,
  FaStar,
} from "react-icons/fa";
import { MdEdit, MdPending } from "react-icons/md";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import usePostReviewModal from "@/hook/usePostReviewModal";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const MyPostReview: React.FC<any> = () => {
  // const dispatch = useDispatch();
  const router = useRouter();
  const postReviewModal = usePostReviewModal();

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
  const words = text.split(" ");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedComment, setIsExpandedComment] = useState<number[]>([]);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [open, setOpen] = useState(false);

  const truncatedText = isExpanded
    ? text
    : words.slice(0, text_max_length).join(" ");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleExpandComment = (index: number) => {
    if (isExpandedComment.includes(index))
      setIsExpandedComment((prev) => prev.filter((item) => item !== index));
    else setIsExpandedComment((prev) => [...prev, index]);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Copy successfully");
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
    // setIsLoading(true);
    setOpen(false);
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
              onClick={() => router.push("/users/5")}
            />
            <div>
              <h1
                className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                onClick={() => router.push("/users/5")}
              >
                Le Minh Tuong
              </h1>{" "}
              <p className="text-sm">11/03/2024</p>
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
                    postReviewModal.onOpen({ data: null, isEdit: true });
                  }}
                >
                  <MdEdit size={24} />
                  <span className="text-lg">Edit this post</span>
                </div>
                <div
                  className="bg-white px-4 py-3 flex justify-start gap-3 items-center"
                  onClick={() => setOpen(true)}
                >
                  <RiDeleteBin5Line size={24} />
                  <span className="text-lg">Delete this post</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Image
          src={
            "https://a0.muscache.com/im/pictures/e35bb307-05f4-48a4-bdc5-3b2198bb9451.jpg?im_w=1440" ||
            emptyImage
          }
          alt="listing"
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-auto max-h-[70vh] mb-4 cursor-pointer"
          style={{ objectFit: "contain" }}
          onClick={() => router.push("/post-reviews/5")}
        />
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
            className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
            onClick={scrollToCommentSection}
          >
            <FaRegCommentDots size={20} />
            <span>Comment</span>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer hover:text-rose-500 space-x-1"
            onClick={handleCopyToClipboard}
          >
            <AiOutlineShareAlt size={20} />
            <span className="text-[16px] ml-4">Copy Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostReview;
