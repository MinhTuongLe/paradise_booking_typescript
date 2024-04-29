"use client";

import { logo } from "@/const";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function Logo({}) {
  const router = useRouter();

  return (
    <div onClick={() => router.push("/")}>
      <Image
        alt="logo"
        className="block cursor-pointer"
        height={100}
        width={100}
        src={logo}
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </div>
  );
}

export default Logo;
