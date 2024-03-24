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
import "../../../../styles/globals.css";
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
import { MdPending } from "react-icons/md";
import EmptyState from "@/components/EmptyState";
import { ReservationSec } from "@/models/place";
import { RatingDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import MyPostReview from "@/components/post-reviews/MyPostReview";
import usePostReviewModal from "@/hook/usePostReviewModal";

export interface ReservationClientProps {
  reservation: ReservationSec | undefined;
  rating: RatingDataSubmit;
}

const MyPostReviewsClient: React.FC<any> = () => {
  const postReviewModal = usePostReviewModal();

  // const dispatch = useDispatch();
  // const router = useRouter();
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


  const scrollToCommentSection = () => {
    if (commentParentRef.current) {
      const container = commentParentRef.current;
      const lastChild = container.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-center items-start w-full">
        <div className="flex-col space-y-12 w-[50%]">
          <div className="mt-10 border-[1px] rounded-xl border-slate-300 px-4 py-3 space-y-4">
            <div
              className="flex items-center space-x-2 relative"
              onClick={() => {
                postReviewModal.onOpen({ data: null, isEdit: false });
              }}
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
                disabled
                className="cursor-pointer resize-none border-solid p-2 rounded-[24px] w-full focus:outline-none border border-gray-300"
                rows={1}
                placeholder="What are you thinking?"
              ></textarea>
              <div className="absolute right-10 top-[50%] -translate-y-[50%] hover:text-rose-500 cursor-pointer">
                <IoMdSend size={24} />
              </div>
            </div>
            <hr />
            <div className="text-center text-lg text-slate-400">
              Share your memorable moments here
            </div>
          </div>
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
          <MyPostReview />
        </div>
      </div>
    </div>
  );
};

export default MyPostReviewsClient;
