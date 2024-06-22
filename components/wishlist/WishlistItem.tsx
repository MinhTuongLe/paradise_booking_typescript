/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { IoIosCloseCircle, IoIosSave } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import Cookie from "js-cookie";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import { API_URL, wishlistCover } from "@/const";
import useWishlistModal from "@/hook/useWishlistModal";
import { Dialog, Transition } from "@headlessui/react";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Wishlist } from "@/models/wishlist";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

interface WishlistItemProps {
  data: Wishlist;
  listingId: number | string | null;
  onActions: any;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  data,
  listingId,
  onActions,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const accessToken = Cookie.get("accessToken");
  const wishlistModal = useWishlistModal();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistLength, setWishlistLength] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [open, setOpen] = useState(false);

  const getPlacesByWishlistId = async () => {
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
      .get(getApiRoute(RouteKey.WishlistPlaceList), config)
      .then((response) => {
        setWishlistLength(response.data.data.length);
      })
      .catch((err) => {
        // toast.error("Something Went Wrong");
      });
    setIsLoading(false);
  };

  const handleAdd = (e: any) => {
    e.stopPropagation();

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
      .post(getApiRoute(RouteKey.PlaceWishlists), submitValues, config)
      .then(() => {
        setIsLoading(false);
        toast.success(
          `${t("toast.add-place-to-wishlist")} ${data.title} ${t(
            "general.successfully"
          )}`
        );
        getPlacesByWishlistId();
        wishlistModal.onClose();
        // window.location.reload();
        router.refresh();
      })
      .catch((err) => {
        toast.error(t("toast.this-place-is-now-in-this-wishlist"));
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();

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
      .put(
        getApiRoute(RouteKey.WishlistDetails, {
          wishlistId: data.id,
        }),
        null,
        config
      )
      .then(() => {
        setIsLoading(false);
        toast.success(t("toast.update-wishlist-title-successfully"));
        setEditMode(false);
        onActions();
      })
      .then(() => {
        getPlacesByWishlistId();
      })
      .catch((err) => {
        toast.error(t("toast.update-wishlist-title-failed"));
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const onDelete = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleDelete = () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .delete(
        getApiRoute(RouteKey.WishlistDetails, {
          wishlistId: data.id,
        }),
        config
      )
      .then(() => {
        setIsLoading(false);
        toast.success(t("toast.delete-wishlist-successfully"));
        setEditMode(false);
        onActions();
      })
      .catch((err) => {
        toast.error(t("toast.delete-wishlist-failed"));
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
        content={t("components.wishlist")}
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
                  src={wishlistCover}
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
                    {t("components.saved")} {wishlistLength || 0}{" "}
                    {t("components.items")}
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
};

export default WishlistItem;
