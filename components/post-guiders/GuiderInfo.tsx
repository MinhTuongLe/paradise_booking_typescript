/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { IconType } from "react-icons";
import { LuCalendarClock } from "react-icons/lu";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

import Avatar from "../Avatar";
import Sleep from "../Sleep";
import Offers from "../Offers";
import { offers, emptyAvatar } from "@/const";
import { User } from "@/models/user";
import { Amenity } from "@/models/place";

interface GuiderInfo {
  user: User | undefined;
  description: string;
  bedCount: number;
  bedRoom: number;
  guestCount: number;
  amenities: Amenity[];
}

const GuiderInfo: React.FC<GuiderInfo> = ({
  user,
  description,
  bedCount,
  bedRoom,
  guestCount,
  amenities,
}) => {
  return (
    <div className="col-span-5 flex flex-col gap-12">
      <div className="w-full flex justify-start items-center">
        <div className="flex flex-col space-y-1 max-w-[90%] mr-4">
          <span className="text-xl font-bold">
            Online itinerary planning hosted by{" "}
            {user?.full_name || user?.username || "Guider"}
          </span>
          <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
            <p>Languages: English, Chinese</p>
          </div>
        </div>
        <Avatar
          src={user?.avatar || emptyAvatar}
          userName={user?.full_name || "-"}
        />
      </div>
      <hr />
      {/* <p className="text-lg font-light text-neutral-500">{description}</p>
      <hr /> */}
      {/* <Sleep />
      <hr /> */}
      <div className="space-y-5 w-full">
        {/* {amenities &&
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
          })} */}
        <div className="flex">
          <div className="w-[5%] mr-4 translate-y-2">
            {React.createElement(LuCalendarClock, {
              size: 25,
              className: "text-gray-700",
            })}
          </div>
          <div className="w-[95%] flex flex-col space-y-[1px]">
            <span className="text-lg font-bold">Meet your needs</span>
            <span className="text-md text-neutral-500">
              Experience organizers can adjust to suit your preferences.
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="w-[5%] mr-4 translate-y-2">
            {React.createElement(LuCalendarClock, {
              size: 25,
              className: "text-gray-700",
            })}
          </div>
          <div className="w-[95%] flex flex-col space-y-[1px]">
            <span className="text-lg font-bold">Meet your needs</span>
            <span className="text-md text-neutral-500">
              Experience organizers can adjust to suit your preferences.
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="w-[5%] mr-4 translate-y-2">
            {React.createElement(LuCalendarClock, {
              size: 25,
              className: "text-gray-700",
            })}
          </div>
          <div className="w-[95%] flex flex-col space-y-[1px]">
            <span className="text-lg font-bold">Meet your needs</span>
            <span className="text-md text-neutral-500">
              Experience organizers can adjust to suit your preferences.
            </span>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <span className="text-xl font-bold">Things you will do</span>
        <div className="flex flex-col space-y-1 font-light text-neutral-700">
          <p>Do you visit Tokyo and use a lot of time to create a schedule?</p>
          <p>
            A local tour guide in Tokyo will help you do it through a video
            call.
          </p>
          <p>- There are gems in Tokyo</p>
          <p>- Transportation system</p>
          <p>- Delicious local cuisine</p>
          <p>- A place.</p>
        </div>
        <span>
          Please ask whatever you need to know. I want to support you to have a
          great trip in Tokyo.
        </span>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <div className="flex justify-start items-center space-x-3 mb-2">
          <Image
            width={50}
            height={50}
            src={emptyAvatar}
            alt="Avatar"
            className="rounded-full h-[50px] w-[50px]"
            priority
          />
          <div>
            <h1 className="text-xl font-bold space-y-1">
              Meet your organizer - Guider
            </h1>
            <p className="text-md text-neutral-400 font-light">
              Organize experience on Paradise since 2024
            </p>
          </div>
        </div>
        <div className="flex items-end gap-6">
          <div className="flex space-x-1 justify-between items-center">
            <FaStar size={16} />
            <span className="">16 comments</span>
          </div>
          <div className="flex space-x-1 justify-between items-center">
            <MdOutlineSecurity size={16} />
            <span className="">Has verified identity</span>
          </div>
        </div>
        <span>Hello, I'm Sumi from Tokyo.</span>
        <div className="flex flex-col space-y-1 font-light text-neutral-700">
          <p>
            I am a Japanese teacher with 2 years of experience and also works as
            a local tour guide. English, Chinese, Japanese available. Through my
            experience, I discovered thousands of Japanese and Japanese cultural
            lovers.
          </p>
          <p>Nice to help guests better understand Japan.</p>
          <p>
            I really want to share my knowledge about Japanese culture and
            language!
          </p>
          <p>You can ask me like ...</p>
          <p>- Why are Japanese so kind?</p>
          <p>- People visit temples/temples</p>
          <p>- </p>
          <p>Come to Tokyo and deeply understand the local culture with me!</p>
        </div>
        <div className="flex flex-col space-y-1 font-light text-neutral-700">
          <p>
            Personal intelligence, I am a big fan of anime! Like, Demon Slayers,
            One Piece, Birmingham, Assak on Titans ....
          </p>
          <p>Let's find out about your favorite anime :)</p>
        </div>
      </div>
    </div>
  );
};

export default GuiderInfo;
