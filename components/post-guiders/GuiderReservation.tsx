"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import { RootState } from "@/store/store";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Counter from "../inputs/Counter";
import { useForm } from "react-hook-form";
import { differenceInCalendarDays } from "date-fns";

interface GuiderReservationProps {
  price: number;
  dateRange: any[];
  onChangeDate: any;
  onSubmit: any;
  disabled: boolean;
  disabledDates: any[];
  isAvailable: boolean;
  changeMode: any;
  showAllDates: any;
}

const GuiderReservation: React.FC<GuiderReservationProps> = ({
  price,
  dateRange,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  isAvailable,
  changeMode,
  showAllDates,
}) => {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      max_guest: 1,
      num_bed: 1,
      bed_room: 1,
    },
  });

  const num_bed = watch("num_bed");
  const bed_room = watch("bed_room");
  const max_guest = watch("max_guest");

  const setCustomValue = (id: any, value: number | File | null) => {
    setValue(id, value);
  };

  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowMaxGuest, setIsShowMaxGuest] = useState(false);
  const [dayCount, setDayCount] = useState(1);

  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);

  const maxGuestFilterSection = useRef<HTMLDivElement>(null);
  const maxGuestPickerSection = useRef<HTMLDivElement>(null);

  const scrollToRateRangeFilterSection = () => {
    if (dateRangeFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        dateRangeFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowDateRange((prev) => !prev);
    }
  };

  const scrollToMaxGuestFilterSection = () => {
    if (maxGuestFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        maxGuestFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowMaxGuest((prev) => !prev);
    }
  };

  useEffect(() => {
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    if (startDate && endDate) {
      const count = differenceInCalendarDays(endDate, startDate);
      setDayCount(count);
    }
  }, [dateRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateRangeFilterSection.current &&
        !dateRangeFilterSection.current.contains(event.target as Node) &&
        dateRangePickerSection.current &&
        !dateRangePickerSection.current.contains(event.target as Node)
      ) {
        setIsShowDateRange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateRangeFilterSection, dateRangePickerSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        maxGuestFilterSection.current &&
        !maxGuestFilterSection.current.contains(event.target as Node) &&
        maxGuestPickerSection.current &&
        !maxGuestPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowMaxGuest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [maxGuestFilterSection, maxGuestPickerSection]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 w-full p-6">
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-1 text-2xl font-semibold">
          From $ {price} <p className="font-light text-neutral-600">/ group</p>
        </div>
        <div className="text-md text-neutral-400 underline cursor-pointer hover:text-rose-500">
          Show all prices
        </div>
      </div>
      <div className="mx-auto grid grid-cols-2 divide-x border-solid border-[1px] border-neutral-500 rounded-xl mt-10">
        <div className="flex justify-between items-center relative">
          <div
            className={`px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tl-xl rounded-bl-xl ${
              !isShowDateRange ? "bg-white" : "bg-rose-500"
            }`}
            onClick={scrollToRateRangeFilterSection}
            ref={dateRangeFilterSection}
          >
            <div className="flex flex-col">
              <span
                className={`text-sm font-semibold ${
                  !isShowDateRange ? "text-neutral-500" : "text-white"
                }`}
              >
                Date
              </span>
              <span
                className={`text-md font-thin ${
                  !isShowDateRange ? "text-neutral-400" : "text-white"
                }`}
              >
                {dayCount > 0 ? dayCount + " (Days)" : "Add Date"}
              </span>
            </div>
            {!isShowDateRange ? (
              <FaAngleDown size={24} />
            ) : (
              <FaAngleUp size={24} className="text-white" />
            )}
          </div>
          <div
            ref={dateRangePickerSection}
            className={`${
              !isShowDateRange
                ? "hidden"
                : "absolute top-[110%] right-0 z-10 w-[40vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
            }`}
          >
            <DateRangePicker
              onChange={(item: any) => onChangeDate([item.selection])}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={dateRange as any}
              direction="horizontal"
              rangeColors={["#f43f5e"]}
            />
          </div>
        </div>
        <div className="flex justify-between items-center relative">
          <div
            className={`px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tr-xl rounded-br-xl ${
              !isShowMaxGuest ? "bg-white" : "bg-rose-500"
            }`}
            onClick={scrollToMaxGuestFilterSection}
            ref={maxGuestFilterSection}
          >
            <div className="flex flex-col">
              <span
                className={`text-sm font-semibold ${
                  !isShowMaxGuest ? "text-neutral-500" : "text-white"
                }`}
              >
                Max guest
              </span>
              <span
                className={`text-md font-thin ${
                  !isShowMaxGuest ? "text-neutral-400" : "text-white"
                }`}
              >
                {max_guest > 0 ? max_guest + " (Persons)" : "Add Max Guests"}
              </span>
            </div>
            {!isShowMaxGuest ? (
              <FaAngleDown size={24} />
            ) : (
              <FaAngleUp size={24} className="text-white" />
            )}
          </div>
          <div
            ref={maxGuestPickerSection}
            className={`${
              !isShowMaxGuest
                ? "hidden"
                : "space-y-6 p-6 absolute top-[110%] right-0 z-10 w-[25vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden bg-white"
            }`}
          >
            <Counter
              title="Guests"
              subtitle="Max guest you have"
              value={max_guest}
              onChange={(value: number) => setCustomValue("max_guest", value)}
            />
            {/* <hr />
            <Counter
              title="Beds"
              subtitle="No beds you want"
              value={num_bed}
              onChange={(value: number) => setCustomValue("num_bed", value)}
            />
            <hr />
            <Counter
              title="Bedrooms"
              subtitle="No bedrooms you need?"
              value={bed_room}
              onChange={(value: number) => setCustomValue("bed_room", value)}
            /> */}
            <Button
              label="Save"
              onClick={() => {
                if (isAvailable) changeMode();
                else onSubmit();
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4 mb-8">
        <div className="flex justify-between items-center my-8">
          <div className="flex flex-col">
            <span className="text-neutral-500 font-semibold">
              Fri, 21/03/2024
            </span>
            <span className="text-neutral-400 font-thin text-sm">
              21:00 - 21:30 (ICT)
            </span>
            <span className="text-neutral-400 font-thin">
              Only for private group
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-md text-neutral-400 font-thin">
              <span className="text-neutral-500 font-semibold">From $33</span> /
              group
            </span>
            <Button
              label="Choose"
              onClick={() => {
                changeMode();
              }}
            />
          </div>
        </div>
        <hr />
        <div className="flex justify-between items-center my-8">
          <div className="flex flex-col">
            <span className="text-neutral-500 font-semibold">
              Fri, 21/03/2024
            </span>
            <span className="text-neutral-400 font-thin text-sm">
              21:00 - 21:30 (ICT)
            </span>
            <span className="text-neutral-400 font-thin">
              Only for private group
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-md text-neutral-400 font-thin">
              <span className="text-neutral-500 font-semibold">From $33</span> /
              group
            </span>
            <Button
              label="Choose"
              onClick={() => {
                changeMode();
              }}
            />
          </div>
        </div>
        <hr />
        <div className="flex justify-between items-center my-8">
          <div className="flex flex-col">
            <span className="text-neutral-500 font-semibold">
              Fri, 21/03/2024
            </span>
            <span className="text-neutral-400 font-thin text-sm">
              21:00 - 21:30 (ICT)
            </span>
            <span className="text-neutral-400 font-thin">
              Only for private group
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-md text-neutral-400 font-thin">
              <span className="text-neutral-500 font-semibold">From $33</span> /
              group
            </span>
            <Button
              label="Choose"
              onClick={() => {
                changeMode();
              }}
            />
          </div>
        </div>
        <hr />
      </div>
      <Button
        label="Show all dates"
        onClick={() => {
          showAllDates();
        }}
      />
    </div>
  );
};

export default GuiderReservation;
