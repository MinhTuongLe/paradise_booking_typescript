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
import { Place } from "@/models/place.ts";
import "../../styles/Home.module.css";
import PaginationComponent from "../PaginationComponent.tsx";
import { Pagination } from "@/models/api.ts";
import { getPriceFormated } from "@/utils/getPriceFormated.ts";

interface PopupPlaceTableProps {
  places: Place[];
  paging: Pagination;
  className?: string;
  ref?: any;
  handleSelectPlace: (place: string) => void;
}

const PopupPlaceTable: React.FC<PopupPlaceTableProps> = ({
  places,
  paging,
  className,
  ref,
  handleSelectPlace,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const params = useSearchParams();

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("general.name"), uid: "name" },
    { name: t("general.address"), uid: "address" },
    { name: t("property-feature.price-per-night"), uid: "price_per_night" },
    { name: t("property-feature.max-guests"), uid: "max_guest" },
    { name: t("property-feature.bedrooms"), uid: "bed_room" },
    { name: t("property-feature.beds"), uid: "num_bed" },
  ];

  const renderCell = useCallback((place: Place, columnKey: string) => {
    const cellValue = place[columnKey as keyof Place];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex justify-start items-center space-x-4 max-w-[250px] text-ellipsis line-clamp-1">
            <Image
              width={40}
              height={40}
              src={place?.images?.[0] || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] aspect-square cursor-pointer"
              priority
              onClick={() => window.open(`/listings/${place.id}`, "_blank")}
            />
            <div>
              <h1
                className="text-md font-bold space-y-3 hover:text-rose-500 cursor-pointer max-w-[200px] text-ellipsis line-clamp-1"
                onClick={() => window.open(`/listings/${place.id}`, "_blank")}
              >
                {cellValue || "-"}
              </h1>
              <span className="max-w-[200px] text-ellipsis line-clamp-1">
                {place?.description || "-"}
              </span>
            </div>
          </div>
        );
      case "address":
        return (
          <span className="max-w-[250px] text-ellipsis line-clamp-2">
            {`${cellValue ? cellValue + ", " : ""} ${
              place?.district ? place?.district + ", " : ""
            } ${place?.state ? place?.state + ", " : ""} ${
              place?.country || "-"
            }`}
          </span>
        );
      case "price_per_night":
        return getPriceFormated(cellValue) + " VND";
      case "max_guest" || "bed_room" || "num_bed":
        return getPriceFormated(cellValue);
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
        onRowAction={(e) => handleSelectPlace(e?.toString())}
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
          {places?.map((account: Place, index: number) => (
            <TableRow
              key={account.id}
              className={`${
                index % 2 !== 0 ? "bg-white" : "bg-slate-100"
              } cursor-pointer`}
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell(account, columnKey as string)}
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

export default PopupPlaceTable;
