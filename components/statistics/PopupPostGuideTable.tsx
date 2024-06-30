/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import { useCallback } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { SHRINK_LIMIT } from "@/const";
import { emptyAvatar } from "../../const.ts";
import "../../styles/Home.module.css";
import PaginationComponent from "../PaginationComponent.tsx";
import { Pagination } from "@/models/api.ts";
import { PostGuider } from "@/models/post.ts";
import { getTopicDescription, getTopicName } from "@/utils/getTopic.ts";

interface PopupPostGuideTableProps {
  posts: PostGuider[];
  paging: Pagination;
  className?: string;
  ref?: any;
  handleSelectPostGuider: (postGuider: string) => void;
}

const PopupPostGuideTable: React.FC<PopupPostGuideTableProps> = ({
  posts,
  paging,
  className,
  ref,
  handleSelectPostGuider,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const params = useSearchParams();

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("general.name"), uid: "title" },
    { name: t("general.address"), uid: "address" },
    { name: t("statistic-feature.topic"), uid: "topic_id" },
    { name: t("post-guider-feature.schedule"), uid: "schedule" },
  ];

  const renderCell = useCallback((postGuider: any, columnKey: string) => {
    const cellValue = postGuider[columnKey as keyof any];

    switch (columnKey) {
      case "title":
        return (
          <div className="flex justify-start items-center space-x-4 max-w-[200px] text-ellipsis line-clamp-1">
            <Image
              width={40}
              height={40}
              src={postGuider?.images?.[0] || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] aspect-square cursor-pointer"
              priority
              onClick={() =>
                window.open(`/post-guiders/${postGuider.id}`, "_blank")
              }
            />
            <div>
              <h1
                className="text-md font-bold space-y-3 hover:text-rose-500 cursor-pointer max-w-[200px] text-ellipsis line-clamp-1"
                onClick={() =>
                  window.open(`/listings/${postGuider.id}`, "_blank")
                }
              >
                {cellValue || "-"}
              </h1>
              <span className="max-w-[200px] text-ellipsis line-clamp-1">
                {postGuider?.description || "-"}
              </span>
            </div>
          </div>
        );
      case "address":
        return (
          <span className="max-w-[250px] text-ellipsis line-clamp-2">
            {`${cellValue ? cellValue + ", " : ""} 
            ${
              postGuider?.location.district
                ? postGuider?.location.district + ", "
                : ""
            } ${
              postGuider?.location.state
                ? postGuider?.location.state + ", "
                : ""
            } ${postGuider?.location.country || "-"}
            `}
          </span>
        );

      case "topic_id":
        return (
          <>
            <div className="break-words max-w-[250px] text-ellipsis line-clamp-2">
              {t(`type-selections.${getTopicName(cellValue)}`)}
            </div>
            <div className="break-words max-w-[250px] text-ellipsis line-clamp-2">
              {t(`type-selections.${getTopicDescription(cellValue)}`)}
            </div>
          </>
        );
      case "schedule":
        return (
          <textarea
            className="whitespace-pre-line w-[250px] bg-transparent"
            rows={3}
          >
            {cellValue || "-"}
          </textarea>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  return (
    <div className={`w-[100%] mx-auto bg-white ${className || ""}`} ref={ref}>
      <Table
        isStriped
        aria-label="Account Table"
        style={{
          padding: 0,
        }}
        className="custom-popup-table"
        onRowAction={(e) => handleSelectPostGuider(e?.toString())}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="text-left bg-rose-500 text-white px-3 py-6 font-bold text-lg"
              key={column.uid}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="mt-8 font-bold text-2xl text-rose-500">
              {t("general.no-data-to-display")}
            </div>
          }
        >
          {posts?.map((post: PostGuider, index: number) => (
            <TableRow
              key={post.id}
              className={`${
                index % 2 !== 0 ? "bg-white" : "bg-slate-100"
              } cursor-pointer`}
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell(post as any, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pb-8">
        {Number(paging?.total ?? 0) >
          (Number(paging?.limit) || SHRINK_LIMIT) && (
          <PaginationComponent
            page={Number(params?.get("page")) || 1}
            total={paging?.total || SHRINK_LIMIT}
            limit={paging?.limit || SHRINK_LIMIT}
          />
        )}
      </div>
    </div>
  );
};

export default PopupPostGuideTable;
