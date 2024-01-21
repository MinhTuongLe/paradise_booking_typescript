"use client";

import React from "react";
import Button from "../Button";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";

interface ListingReservationProps {
  price: number,
  dateRange: any[],
  totalPrice: number,
  onChangeDate: any,
  onSubmit: any,
  disabled: boolean,
  disabledDates: any[],
  isAvailable: boolean,
  changeMode: any,
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
  const loggedUser = useSelector((state: any) => state.authSlice.loggedUser);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden w-full">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="flex gap-1 text-2xl font-semibold">
          $ {price} <p className="font-light text-neutral-600">/ night</p>
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
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={dateRange}
        direction="vertical"
        disabledDates={disabledDates}
        rangeColors={["#f43f5e"]}
      />
      {loggedUser.role !== 3 && (
        <>
          <hr />
          <div className="p-4">
            <Button
              disabled={disabled}
              label={!isAvailable ? "Check Availability" : "Reserve"}
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
        <p>Total</p>
        <p> $ {totalPrice}</p>
      </div>
    </div>
  );
}

export default ListingReservation;
