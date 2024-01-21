"use client";
import React from "react";
import Link from "next/link";
import { FcPrevious, FcNext } from "react-icons/fc";
import { usePathname } from "next/navigation";

interface PaginationComponentProps {
  page: number,
  total: number,
  limit: number
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ page, total, limit }) => {
  const totalPages = Math.ceil(total / limit);
  const pathname = usePathname();

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        Math.min(
          page - Math.floor(maxPagesToShow / 2),
          totalPages - maxPagesToShow + 1
        )
      );
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

      {getPageNumbers().map((pageNumber) => (
        <Link
          legacyBehavior
          key={pageNumber}
          href={`${pathname}/?page=${pageNumber}&limit=${limit}`}
        >
          <a
            className={`border px-4 py-2 rounded ${page === pageNumber ? "bg-rose-500 text-white" : ""
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
