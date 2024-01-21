/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { IoIosCloseCircle, IoIosSave, IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { API_URL } from "@/const";
import Cookie from "js-cookie";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import useWishlistModal from "@/hook/useWishlistModal";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "../Button";
import ConfirmDeleteModal from "../models/ConfirmDeleteModal";
import { Wishlist } from "@/models/wishlist";

interface WishlistCardProps {
  data: Wishlist
}

const WishlistCard: React.FC<WishlistCardProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLength, setWishlistLength] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [open, setOpen] = useState(false);

  const getPlacesByWishlistId = async () => {
    const accessToken = Cookie.get("accessToken");
    const config = {
      params: {
        wish_list_id: data.id,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .get(`${API_URL}/place_wish_lists/place`, config)
      .then((response) => {
        setWishlistLength(response.data.data.length);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
      });
    setIsLoading(false);
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    const accessToken = Cookie.get("accessToken");

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        title: title,
      },
    };

    axios
      .put(`${API_URL}/wish_lists/${data.id}`, null, config)
      .then(() => {
        setIsLoading(false);
        toast.success(`Update Wishlist Title Successfully`);
        router.refresh();
        setEditMode(false);
      })
      // .then(() => {
      //   getPlacesByWishlistId();
      // })
      .catch((err) => {
        toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const onDelete = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleDeleteWishlist = () => {
    const accessToken = Cookie.get("accessToken");

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .delete(`${API_URL}/wish_lists/${data.id}`, config)
      .then(() => {
        setIsLoading(false);
        toast.success(`Delete Wishlist Successfully`);
        router.refresh();
        setEditMode(false);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        setIsLoading(false);
      });
    setOpen(false);
  };

  useEffect(() => {
    getPlacesByWishlistId();
  }, []);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDeleteWishlist}
        content="wishlist"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="col-span-1 group"
      >
        <div className="flex flex-col gap-2 w-full relative">
          <div
            className="aspect-square w-full relative oerflow-hidden rounded-xl cursor-pointer "
            onClick={() => router.push(`/favorites/${data.id}`)}
          >
            <Image
              fill
              className="object-cover aspect-square h-full w-full rounded-xl"
              src="/assets/wishlist_cover.png"
              alt="wishlists"
              priority
            />
          </div>
          <div className="font-semibold text-lg text-ellipsis line-clamp-1">
            {!editMode ? (
              <div className="flex flex-col items-start justify-start">
                <div
                  className="flex font-semibold text-lg text-ellipsis line-clamp-1 cursor-pointer justify-start items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(true);
                  }}
                >
                  <CiEdit size={16} className="mr-2" />
                  {data.title || "-"}
                </div>
                <div className="font-light text-neutral-500 text-ellipsis line-clamp-1">
                  Saved {wishlistLength || 0} item(s)
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                  <div className="font-light text-neutral-500 text-ellipsis line-clamp-1">
                    Saved {wishlistLength || 0} item(s)
                  </div>
                </div>
                <div className="bg-white rounded-full p-2 border-[#1975d3] border-[1px] overflow-hidden">
                  <IoIosSave
                    color="#1975d3"
                    size={24}
                    onClick={handleEdit}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
          <div
            className="cursor-pointer absolute top-2 right-2 text-rose-500 border-[3px] rounded-full p-2 hover:bg-rose-500 hover:text-white font-bold"
            onClick={onDelete}
            style={{
              borderColor: "#f43f5e",
            }}
          >
            <IoMdClose size={24} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default WishlistCard;
