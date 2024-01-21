import Image from "next/image";
import React from "react";
import { IoMdClose } from "react-icons/io";
import {emptyAvatar} from "../const"

function Notification({ id, content, avatar, date, closeIcon }) {
  return (
    <div className="mb-6 relative w-full flex justify-start items-center space-x-6">
      <Image
        src={avatar || emptyAvatar}
        alt="Avatar"
        className="rounded-full w-[56px] h-[56px]"
        width={56}
        height={56}
        priority
      />
      <div className="block max-w-[70%]">
        <div className="text-lg font-bold truncate ">{content}</div>
        <div className="text-md">{date}</div>
      </div>
      {closeIcon && (
        <button
          className="p-1 border-0 hover:opacity-70 transition absolute right-4"
          // onClick={}
        >
          <IoMdClose size={24} />
        </button>
      )}
    </div>
  );
}

export default Notification;
