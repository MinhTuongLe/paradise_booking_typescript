/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { IoIosCloseCircle, IoIosSave, IoMdClose } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import Cookie from "js-cookie";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import { API_URL } from "@/const";
import useWishlistModal from "@/hook/useWishlistModal";
import Button from "../Button";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Wishlist } from "@/models/wishlist";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

interface WishlistCardProps {
  data: Wishlist;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ data }) => {
  const { t } = useTranslation("translation", { i18n });
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
      .get(getApiRoute(RouteKey.WishlistPlaceList), config)
      .then((response) => {
        setWishlistLength(response.data.data.length);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
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
        router.refresh();
        setEditMode(false);
      })
      // .then(() => {
      //   getPlacesByWishlistId();
      // })
      .catch((err) => {
        console.log(err);
        toast.error(t("toast.update-wishlist-title-failed"));
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
      .delete(
        getApiRoute(RouteKey.WishlistDetails, {
          wishlistId: data.id,
        }),
        config
      )
      .then(() => {
        setIsLoading(false);
        toast.success(t("toast.delete-wishlist-successfully"));
        router.refresh();
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
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
        onDelete={handleDeleteWishlist}
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
                  {t("components.saved")} {wishlistLength || 0}{" "}
                  {t("components.items")}
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
                    {t("components.saved")} {wishlistLength || 0}{" "}
                    {t("components.items")}
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
};

export default WishlistCard;
