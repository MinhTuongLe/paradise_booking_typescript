/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import React from "react";

interface AvatarProps {
  src: string;
  userName: string;
}

const  Avatar: React.FC<AvatarProps>  = ({ src, userName }) => {
  return (
    <div className="h-[42px] w-[42px]">
      {src ? (
        <Image
          className="rounded-full object-cover h-full w-full"
          height="56"
          width="56"
          alt="hasImag"
          src={src}
        /> 
      ) : userName ? (
        <img
          className="rounded-full object-cover"
          alt="nameImage"
          src={`https://ui-avatars.com/api/?name=${userName}`}
        />
      ) : (
        <img
          className="rounded-full"
          height="30"
          width="30"
          alt="noUser"
          src="/assets/avatar.png"
        />
      )}
    </div>
  );
}

export default Avatar;
