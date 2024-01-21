"use client";

import React from "react";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import Sleep from "../Sleep";
import Offers from "../Offers";
import { offers, emptyAvatar } from "@/const";
import { User } from "@/models/user";
import { Amenity } from "@/models/place";

interface ListingInfo {
  user: User,
  description: string,
  bedCount: number,
  bedRoom: number,
  guestCount: number,
  amenities: Amenity[],
}

const ListingInfo: React.FC<ListingInfo> = ({
  user,
  description,
  bedCount,
  bedRoom,
  guestCount,
  amenities,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className=" text-xl font-semibold flex flex-row items-center gap-2">
          <div
            className="cursor-pointer hover:text-rose-500"
            onClick={() => window.open(`/users/${user.id}`, "_blank")}
          >
            Hosted by {user.full_name || user.username || "Vendor"}
          </div>
          <Avatar src={user.avatar || emptyAvatar} userName={user.full_name} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <p>{guestCount} guests</p>
          <p>{bedCount} beds</p>
          <p>{bedRoom} bedrooms</p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col">
        <p className="text-4xl font-bold text-[#FF5A5F]">
          paradise<span className="text-black">cover</span>
        </p>
        <p className="text-neutral-500 pt-3">
          Every booking includes free protection from Host cancellations,
          listing inaccuracies, and other issues like trouble checking in.
        </p>
        <p className="text-black font-bold underline pt-3 cursor-pointer">
          Learn more
        </p>
      </div>
      <hr />
      <p className="text-lg font-light text-neutral-500">{description}</p>
      <hr />
      {/* <Sleep />
      <hr /> */}
      <div className="grid grid-cols-12 gap-x-12 gap-y-3 mb-8 w-full">
        {amenities &&
          amenities.map((item, index) => {
            const offerItem = offers.find(
              (offer) => offer.label === item.description
            );
            return (
              <div
                key={index}
                className="col-span-6 flex justify-between items-center text-center gap-4 my-1 cursor-pointer"
              >
                <label
                  htmlFor={`type-${index}`}
                  className="text-lg text-zinc-600 font-thin cursor-pointer flex items-center justify-between space-x-6"
                >
                  {offerItem && (
                    <>
                      {React.createElement(offerItem.icon, {
                        size: 25,
                        className: "text-gray-700",
                      })}
                    </>
                  )}
                  <p className="text-neutral-500">{item?.description || "-"}</p>
                </label>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ListingInfo;
