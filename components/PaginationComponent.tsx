"use client";
import React from "react";
import Link from "next/link";
import { FcPrevious, FcNext } from "react-icons/fc";
import { usePathname } from "next/navigation";

import { LIMIT } from "@/const";

interface PaginationComponentProps {
  page: number | string | undefined;
  total: number | string | undefined;
  limit: number | string | undefined;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  page,
  total,
  limit,
}) => {
  page = page ? (typeof page === "string" ? Number(page) : page) : 1;
  total = total ? (typeof total === "string" ? Number(total) : total) : LIMIT;
  limit = limit ? (typeof limit === "string" ? Number(limit) : limit) : LIMIT;
  const totalPages = Math.ceil(total / limit);
  const pathname = usePathname();

  const getPageNumbers = (page:number | undefined) => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = page
        ? Math.max(
            1,
            Math.min(
              page - Math.floor(maxPagesToShow / 2),
              totalPages - maxPagesToShow + 1
            )
          )
        : 1;
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="w-full flex justify-center items-center space-x-6 mt-6">
      {page > 1 && (
        <Link
          legacyBehavior
          href={`${pathname}/?page=${page - 1}&limit=${limit}`}
        >
          <FcPrevious className="text-[24px] cursor-pointer" />
        </Link>
      )}

      {getPageNumbers(page).map((pageNumber) => (
        <Link
          legacyBehavior
          key={pageNumber}
          href={`${pathname}/?page=${pageNumber}&limit=${limit}`}
        >
          <a
            className={`border px-4 py-2 rounded ${
              page === pageNumber ? "bg-rose-500 text-white" : ""
            }`}
          >
            {pageNumber}
          </a>
        </Link>
      ))}

      {page < totalPages && (
        <Link
          legacyBehavior
          href={`${pathname}/?page=${page + 1}&limit=${limit}`}
        >
          <FcNext className="text-[24px] cursor-pointer" />
        </Link>
      )}
    </div>
  );
};

export default PaginationComponent;
