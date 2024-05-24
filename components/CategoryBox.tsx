"use client";

import qs from "query-string";
import React, { useCallback } from "react";
import { IconType } from "react-icons";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { RootState } from "@/store/store";
import { Role } from "@/enum";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  route: string;
}

interface UpdatedQueryProps {
  category?: string;
  [key: string]: string | undefined;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  route,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const handleClick = useCallback(() => {
    if (loggedUser?.role === Role.Admin) {
      router.push(`/${route.toLowerCase()}`);
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
        url: pathName || "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, params, router, loggedUser?.role, pathName, route]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
        selected ? "border-b-rose-500" : "border-transparent"
      } ${selected ? "text-rose-500" : "text-neutral-500"}`}
    >
      <Icon size={26} />
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
};

export default CategoryBox;
