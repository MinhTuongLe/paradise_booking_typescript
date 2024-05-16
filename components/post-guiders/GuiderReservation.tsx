"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import { useForm } from "react-hook-form";
import { differenceInCalendarDays, formatISO } from "date-fns";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import i18n from "@/i18n/i18n";
import Button from "../Button";
import { RootState } from "@/store/store";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Counter from "../inputs/Counter";
import { CalendarPostGuider } from "@/models/post";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { BookingGuiderStatus } from "@/enum";
import { formatDateTimeType, maxPrice } from "@/const";
import { DateRange } from "@/models/place";
import RangeSlider from "../RangeSlider";

interface GuiderReservationProps {
  calendarData: CalendarPostGuider[];
  changeMode: any;
  onSubmit: any;
  disabled: boolean;
  showAllDates: any;
  postguiderId: number;
}

const GuiderReservation: React.FC<GuiderReservationProps> = ({
  calendarData,
  onSubmit,
  disabled,
  changeMode,
  showAllDates,
  postguiderId,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowMaxGuest, setIsShowMaxGuest] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [price_from, setPriceFrom] = useState(0);
  const [price_to, setPriceTo] = useState(maxPrice);
  const [isShowPriceRange, setIsShowPriceRange] = useState(false);

  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);

  const priceRangeFilterSection = useRef<HTMLDivElement>(null);
  const priceRangePickerSection = useRef<HTMLDivElement>(null);

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

  const scrollToPriceRangeFilterSection = () => {
    if (priceRangeFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        priceRangeFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowPriceRange((prev) => !prev);
    }
  };

  const onSubmitUpdateQuery = useCallback(async () => {
    // if (step !== SearchModalOptions.PRICE) {
    //   return onNext();
    // }

    let currentQuery = {};
    let updatedQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      date_from: dateRange[0]?.startDate
        ? dayjs(formatISO(dateRange[0].startDate)).format(
            formatDateTimeType.DMY_HMS2
          )
        : "",
      date_to: dateRange[0]?.endDate
        ? dayjs(formatISO(dateRange[0].endDate)).format(
            formatDateTimeType.DMY_HMS2
          )
        : "",
      price_from: price_from,
      price_to: price_to,
    };

    // if (lat && lng) {
    //   updatedQuery = {
    //     ...currentQuery,
    //     lat: lat,
    //     lng: lng,
    //   };
    // }
    // if (dateRange[0]?.startDate && dateRange[0]?.endDate) {
    //   updatedQuery = {
    //     ...currentQuery,
    //     date_from: dateRange[0]?.startDate
    //       ? formatISO(dateRange[0].startDate)
    //           .split("T")[0]
    //           .split("-")
    //           .reverse()
    //           .join("-")
    //       : "",
    //     date_to: dateRange[0]?.endDate
    //       ? formatISO(dateRange[0].endDate)
    //           .split("T")[0]
    //           .split("-")
    //           .reverse()
    //           .join("-")
    //       : "",
    //   };
    // }
    // if (guest && num_bed) {
    //   updatedQuery = {
    //     ...currentQuery,
    //     guest: guest,
    //     num_bed: num_bed,
    //   };
    // }
    // if (price_from >= 0 && price_to >= 0 && price_from <= price_to) {
    //   updatedQuery = {
    //     ...currentQuery,
    //     price_from: price_from,
    //     price_to: price_to,
    //   };
    // }

    const url = qs.stringifyUrl(
      {
        url: pathName || `/post-guiders/${postguiderId}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, dateRange, price_from, price_to, params]);

  const handleClearAllFilters = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setPriceFrom(0);
    setPriceTo(maxPrice);
    const url = qs.stringifyUrl({
      url: pathName || `/post-guiders/${postguiderId}`,
      query: {},
    });

    router.push(url);
  };

  const onSubmitCallback = (minValue: number, maxValue: number) => {
    setPriceFrom(minValue);
    setPriceTo(maxValue);
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
        priceRangeFilterSection.current &&
        !priceRangeFilterSection.current.contains(event.target as Node) &&
        priceRangePickerSection.current &&
        !priceRangePickerSection.current.contains(event.target as Node)
      ) {
        setIsShowPriceRange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [priceRangeFilterSection, priceRangePickerSection]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 w-full p-6">
      {/* <div className="flex flex-col items-start gap-1">
        <div className="flex gap-1 text-2xl font-semibold">
          From {price} VND{" "}
          <p className="font-light text-neutral-600">/ group</p>
        </div>
        <div className="text-md text-neutral-400 underline cursor-pointer hover:text-rose-500">
          Show all prices
        </div>
      </div> */}
      <div className="flex flex-col">
        <div className="mx-auto grid grid-cols-2 divide-x border-solid border-[1px] border-neutral-500 rounded-xl mt-6 mb-8">
          <div className="flex justify-between items-center relative">
            <div
              className={`h-full px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tl-xl rounded-bl-xl ${
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
                  {t("components.date")}
                </span>
                <span
                  className={`text-md font-thin ${
                    !isShowDateRange ? "text-neutral-400" : "text-white"
                  }`}
                >
                  {dayCount > 0
                    ? dayCount + ` (${t("general.days")})`
                    : t("general.any-week")}
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
                onChange={(item: any) => setDateRange([item.selection])}
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
              className={`h-full px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tr-xl rounded-br-xl ${
                !isShowPriceRange ? "bg-white" : "bg-rose-500"
              }`}
              onClick={scrollToPriceRangeFilterSection}
              ref={priceRangeFilterSection}
            >
              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold ${
                    !isShowPriceRange ? "text-neutral-500" : "text-white"
                  }`}
                >
                  {t("general.price-range")}
                </span>
                <span
                  className={`text-md font-thin ${
                    !isShowPriceRange ? "text-neutral-400" : "text-white"
                  }`}
                >
                  {`${getPriceFormated(
                    Number(price_from)
                  )} VND - ${getPriceFormated(Number(price_to))} VND`}{" "}
                </span>
              </div>
              {!isShowPriceRange ? (
                <FaAngleDown size={24} />
              ) : (
                <FaAngleUp size={24} className="text-white" />
              )}
            </div>
            <div
              ref={priceRangePickerSection}
              className={`${
                !isShowPriceRange
                  ? "hidden"
                  : "absolute top-[110%] right-0 z-10 w-[30vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
              }`}
            >
              <RangeSlider
                initialMin={params?.get("price_from") || 0}
                initialMax={params?.get("price_to") || maxPrice}
                min={0}
                max={maxPrice}
                step={100000}
                priceCap={1000}
                onSubmitCallback={onSubmitCallback}
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-6">
          <Button label={t("general.filter")} onClick={onSubmitUpdateQuery} />
          <Button
            outline
            label={t("general.clear-all")}
            onClick={handleClearAllFilters}
          />
        </div>
      </div>
      <div className="flex flex-col mt-4">
        {calendarData &&
          calendarData.length > 0 &&
          (calendarData.length > 4
            ? calendarData.slice(0, 4)
            : calendarData
          ).map((element, index) => (
            <div key={element.id}>
              <div className="flex justify-between items-start my-8 space-x-12">
                <div className="flex flex-col">
                  <span className="text-neutral-500 font-semibold">
                    {element.date_from.split(" ")[0]} -{" "}
                    {element.date_to.split(" ")[0]}
                  </span>
                  <span className="text-neutral-400 font-thin text-sm">
                    {element.date_from.split(" ")[1]} -{" "}
                    {element.date_to.split(" ")[1]}
                  </span>
                  <div className="pt-4 flex flex-col space-y-1">
                    <span className="font-thin">
                      {t("post-guider-feature.for-up-to")} {element.max_guest}{" "}
                      {t("components.guests")}
                    </span>
                    <span className="font-thin text-ellipsis line-clamp-1">
                      {element.note}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between space-y-8">
                  <span className="text-md text-neutral-400 font-thin">
                    <span className="font-semibold">
                      {t("general.from")}{" "}
                      {getPriceFormated(element?.price || 0)} VND
                    </span>{" "}
                    / {t("post-guider-feature.person")}
                  </span>
                  <Button
                    disabled={!element.status}
                    label="Choose"
                    onClick={() => {
                      changeMode(element);
                    }}
                  />
                </div>
              </div>
              {index < calendarData.length - 1 && <hr />}
            </div>
          ))}
      </div>
      {calendarData && calendarData.length > 4 && (
        <div className="space-y-8">
          <hr />
          <Button
            label="Show all dates"
            onClick={() => {
              showAllDates();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GuiderReservation;
