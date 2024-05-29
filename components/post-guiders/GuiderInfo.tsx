/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Avatar from "../Avatar";
import { post_guider_amenities, emptyAvatar, formatDateType } from "@/const";
import { User } from "@/models/user";
import { Amenity, Rating } from "@/models/place";
import { getOwnerName } from "@/utils/getUserInfo";
import Expandable from "../Expandable";
import { PostOwnerType } from "@/models/post";

interface GuiderInfo {
  postOwner: PostOwnerType;
  postOwnerId: number;
  description: string;
  amenities: Amenity[];
  owner_full_data: User;
  languages: string[];
  schedule: string;
  ratings: Rating[];
}

const GuiderInfo: React.FC<GuiderInfo> = ({
  postOwner,
  postOwnerId,
  description,
  amenities,
  owner_full_data,
  languages,
  schedule,
  ratings,
}) => {
  const { t } = useTranslation("translation", { i18n });
  return (
    <div className="col-span-7 flex flex-col gap-12">
      <div className="gap-6">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col space-y-1 max-w-[90%] mr-4">
            <div className="text-xl font-bold flex">
              {t("post-guider-feature.itinerary-planning-hosted-by")}
              <div
                className="ml-1 cursor-pointer hover:text-rose-500"
                onClick={() => window.open(`/users/${postOwnerId}`, "_blank")}
              >
                {postOwner ? getOwnerName(postOwner) : "Guider"}
              </div>
            </div>
            {languages && languages.length > 0 && (
              <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                <span>{t("request-feature.languages")}:</span>
                <div>
                  {languages.map((language: string, index: number) => (
                    <span key={index}>
                      {t(`multiSelect.${language}`) || "Tiếng Việt"}{" "}
                      {index < languages.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Avatar
            src={postOwner.avatar || emptyAvatar}
            userName={postOwner ? getOwnerName(postOwner) : "-"}
          />
        </div>
        <div className="flex flex-row items-center font-light text-neutral-500">
          <p>{description}</p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <span className="text-xl font-bold">
          {t("post-guider-feature.things-you-will-do")}
        </span>
        <div className="flex flex-col space-y-1 font-light text-neutral-700">
          <p className="whitespace-pre-line">{schedule || "-"}</p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <span className="text-xl font-bold">
          {t("post-guider-feature.you-will-receive")}
        </span>
        <div className="flex flex-nowrap overflow-x-scroll gap-6 vendor-room-listing pb-2">
          {amenities &&
            amenities.map((item, index) => {
              const offerItem = post_guider_amenities.find(
                (offer) => offer.value === item.description
              );
              return (
                <div
                  key={index}
                  className="px-4 py-6 border-[1px] border-neutral-200 rounded-lg w-[30%] flex-shrink-0"
                >
                  {offerItem && (
                    <>
                      {React.createElement(offerItem.icon, {
                        size: 25,
                        className: "text-gray-700 text-[36px]",
                      })}
                    </>
                  )}
                  <span className="text-lg font-bold line-clamp-1 text-ellipsis">
                    {offerItem
                      ? t(`post-guider-amenities.${offerItem.label}`)
                      : "-"}
                  </span>
                  <p className="font-light text-neutral-700 line-clamp-4 text-ellipsis">
                    <Expandable
                      maxCharacters={20}
                      text={offerItem?.description || "-"}
                    />
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-start items-center space-x-3 mb-2">
          <Image
            width={50}
            height={50}
            src={owner_full_data.avatar || emptyAvatar}
            alt="Avatar"
            className="rounded-full h-[50px] w-[50px]"
            priority
          />
          <div>
            <h1 className="text-xl font-bold space-y-1">
              {t("post-guider-feature.meet-your-organizer")}
            </h1>
            <p className="text-md text-neutral-400 font-light">
              {t("post-guider-feature.organize-experience-on-paradise-since")}{" "}
              {dayjs(owner_full_data.created).format(formatDateType.DMY)}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-6">
          <div className="flex space-x-1 justify-between items-center">
            <FaStar size={16} />
            <span className="">
              {ratings.length} {t("components.comments")}
            </span>
          </div>
          <div className="flex space-x-1 justify-between items-center">
            <MdOutlineSecurity size={16} />
            <span className="">
              {t("post-guider-feature.has-verified-identity")}
            </span>
          </div>
        </div>
        <span>
          {t("post-guider-feature.hello-im")}{" "}
          {getOwnerName(postOwner) || t("post-guider-feature.this-post-guider")}{" "}
          {owner_full_data?.address &&
            ` ${t("general.from")} ${owner_full_data.address}`}
          .
        </span>
        <div className="flex flex-col space-y-1 font-light text-neutral-700">
          <p>{owner_full_data?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default GuiderInfo;
