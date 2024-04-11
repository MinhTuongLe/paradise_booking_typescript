"use client";

import qs from "query-string";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { getRoleId } from "@/utils/getUserInfo";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean
}

interface UpdatedQueryProps {
  category?: string;
  [key: string]: string | undefined;
}

const CategoryBox:React.FC<CategoryBoxProps> =  ({ icon: Icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();
  const loggedUser = useSelector((state:RootState) => state.authSlice.loggedUser);

  const handleClick = useCallback(() => {
    if (loggedUser?.role === getRoleId(Role.Admin)) {
      router.push(`/${label.toLowerCase()}`);
      return;
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: UpdatedQueryProps = {
      ...currentQuery,
      category: label,
    };

    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, params, router, loggedUser?.role]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
        selected ? "border-b-neutral-800" : "border-transparent"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      <Icon size={26} />
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
}

export default CategoryBox;
