/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { IoIosCloseCircle, IoIosSave } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { API_URL } from "@/const";
import Cookie from "js-cookie";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import useWishlistModal from "@/hook/useWishlistModal";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "../models/ConfirmDeleteModal";

function WishlistItem({ data, listingId, onActions }) {
  const router = useRouter();
  const wishlistModal = useWishlistModal();
  const [isLoading, setIsLoading] = useState(true);
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

  const handleAdd = (e) => {
    e.stopPropagation();

    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const submitValues = {
      place_id: listingId,
      wishlist_id: data.id,
    };

    axios
      .post(`${API_URL}/place_wish_lists`, submitValues, config)
      .then(() => {
        setIsLoading(false);
        toast.success(`Add Place To Wishlist ${data.title} Successfully`);
        getPlacesByWishlistId();
        wishlistModal.onClose();
        // window.location.reload();
        router.refresh();
      })
      .catch((err) => {
        toast.error("This place is now in this wishlist");
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const handleEdit = (e) => {
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
        setEditMode(false);
        onActions();
      })
      .then(() => {
        getPlacesByWishlistId();
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const onDelete = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleDelete = () => {
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
        setEditMode(false);
        onActions();
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
        onDelete={handleDelete}
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
        {!isLoading ? (
          <div className="flex space-x-6 w-full justify-start items-center">
            <div
              className="flex gap-4 items-center justify-start w-[70%] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/favorites/${data.id}`);
                wishlistModal.onClose();
              }}
            >
              <div className="aspect-square w-[64px] relative overflow-hidden rounded-xl">
                <Image
                  fill
                  className="object-cover aspect-square h-full w-full group-hover:scale-110 transition  rounded-xl"
                  src="/assets/wishlist_cover.png"
                  alt="listing"
                  priority
                />
              </div>
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
                <div className="flex items-start justify-start">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end items-start space-x-3 w-[30%]">
              {!editMode ? (
                <>
                  <FaPlusCircle
                    onClick={handleAdd}
                    size={36}
                    className="bg-[#05a569] rounded-full text-white hover:brightness-75 cursor-pointer"
                  />
                  <IoIosCloseCircle
                    onClick={onDelete}
                    size={36}
                    className="bg-rose-500 text-white rounded-full hover:brightness-75 cursor-pointer"
                  />
                </>
              ) : (
                <div className="bg-white rounded-full p-2 border-[#1975d3] border-[1px] overflow-hidden">
                  <IoIosSave
                    color="#1975d3"
                    size={24}
                    onClick={handleEdit}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div role="status" className="w-full animate-pulse">
            <div className="h-[64px] bg-gray-200 rounded-2xl dark:bg-gray-400 mb-4"></div>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default WishlistItem;
