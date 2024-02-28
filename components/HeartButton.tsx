"use client";

import useWishlistModal from "@/hook/useWishlistModal";
import useLoginModal from "@/hook/useLoginModal";

import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface HeartButtonProps {
  listingId: number,
  isFree: boolean
}

const HeartButton:React.FC<HeartButtonProps> = ({ listingId, isFree }) => {
  const authState = useSelector((state: RootState) => state.authSlice.authState);
  const wishlistModal = useWishlistModal();
  const loginModal = useLoginModal();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (authState) wishlistModal.onOpen(listingId);
        else loginModal.onOpen();
      }}
      className=" relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={!isFree ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
}

export default HeartButton;
