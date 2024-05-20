"use client";

import React from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Button from "../Button";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { getPriceFormated } from "@/utils/getPriceFormated";

interface ListingReservationProps {
  price: number;
  dateRange: any[];
  totalPrice: number;
  onChangeDate: any;
  onSubmit: any;
  disabled: boolean;
  disabledDates: any[];
  isAvailable: boolean;
  changeMode: any;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  isAvailable,
  changeMode,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden w-full">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="flex gap-1 text-2xl font-semibold">
          {getPriceFormated(price)} VND{" "}
          <p className="font-light text-neutral-600">
            / {t("components.night")}
          </p>
        </div>
      </div>
      <hr />
      {/* <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      /> */}
      <DateRangePicker
        onChange={(item) => onChangeDate([item.selection])}
        // showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={dateRange}
        direction="vertical"
        disabledDates={disabledDates}
        rangeColors={["#f43f5e"]}
      />
      {loggedUser?.role !== Role.Admin && (
        <>
          <hr />
          <div className="p-4">
            <Button
              disabled={disabled}
              label={
                !isAvailable
                  ? t("components.check-availability")
                  : t("components.reserve")
              }
              onClick={() => {
                if (isAvailable) changeMode();
                else onSubmit();
              }}
            />
          </div>
        </>
      )}
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <p>{t("components.total")}</p>
        <p> {getPriceFormated(totalPrice)} VND</p>
      </div>
    </div>
  );
};

export default ListingReservation;
