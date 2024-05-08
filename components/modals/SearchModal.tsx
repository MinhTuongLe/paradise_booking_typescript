/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { formatISO, addDays } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useSearchModal from "@/hook/useSearchModal";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import Modal from "./Modal";
import FiltersModal from "./FiltersModal";
import RangeSlider from "../RangeSlider";
import { maxPrice } from "@/const";
import { DateRange } from "@/models/place";
import { SearchModalOptions } from "@/enum";

function SearchModal({}) {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const searchModel = useSearchModal();

  const [location, setLocation] = useState();
  const [step, setStep] = useState<SearchModalOptions>(searchModel.option);
  const [guest, setGuest] = useState(1);
  const [num_bed, setBedCount] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [price_from, setPriceFrom] = useState(0);
  const [price_to, setPriceTo] = useState(maxPrice);

  const onSubmitCallback = (minValue: number, maxValue: number) => {
    setPriceFrom(minValue);
    setPriceTo(maxValue);
  };

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  // const onBack = () => {
  //   setStep((value) => value - 1);
  // };

  const onNext = () => {
    setStep((value) => value + 1);
    searchModel.onOpen(step + 1);
  };

  const onSubmit = useCallback(async () => {
    // if (step !== SearchModalOptions.PRICE) {
    //   return onNext();
    // }

    let currentQuery = {};
    let updatedQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    if (step === Number(SearchModalOptions.LOCATION)) {
      updatedQuery = {
        ...currentQuery,
        lat: lat,
        lng: lng,
      };
    } else if (step === Number(SearchModalOptions.DATE)) {
      updatedQuery = {
        ...currentQuery,
        date_from: dateRange[0]?.startDate
          ? formatISO(dateRange[0].startDate)
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-")
          : "",
        date_to: dateRange[0]?.endDate
          ? formatISO(dateRange[0].endDate)
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-")
          : "",
      };
    } else if (step === Number(SearchModalOptions.INFO)) {
      updatedQuery = {
        ...currentQuery,
        guest: guest,
        num_bed: num_bed,
      };
    } else if (step === Number(SearchModalOptions.PRICE)) {
      updatedQuery = {
        ...currentQuery,
        price_from: price_from,
        price_to: price_to,
      };
    }

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
        url: pathName || "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    searchModel.onClose();

    router.push(url);
  }, [
    step,
    searchModel,
    location,
    router,
    guest,
    num_bed,
    dateRange,
    price_from,
    price_to,
    // onNext,
    params,
    lat,
    lng,
  ]);

  const actionLabel = useMemo(() => {
    // if (step === SearchModalOptions.PRICE) {
    //   return "Search";
    // }
    // return "Next";
    return t("general.search");
  }, [step]);

  // const secondActionLabel = useMemo(() => {
  //   if (step === SearchModalOptions.LOCATION) {
  //     return undefined;
  //   }

  //   return "Back";
  // }, [step]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    setStep(searchModel.option);
  }, [searchModel.option]);

  // useEffect(() => {
  //   if (searchModel.isOpen && searchModel.option === SearchModalOptions.DATE) {
  //     setDateRange([
  //       {
  //         startDate: new Date(),
  //         endDate: new Date(),
  //         key: "selection",
  //       },
  //     ]);
  //   }
  // }, [searchModel.isOpen]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title={t("components.where-do-you-wanna-go")}
        subtitle={t("components.find-the-perfect-location")}
        center
      />
      <div className="w-full relative">
        <input
          value={searchResult?.label || ""}
          id="_location"
          readOnly={true}
          className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 cursor-not-allowed border-neutral-300 focus:outline-none`}
        />
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
        >
          {t("components.location")}
        </label>
      </div>
      <Map
        center={[lat || 51, lng || -0.09]}
        onSearchResult={handleSearchResult}
      />
    </div>
  );

  if (step === SearchModalOptions.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.when-do-you-plan-to-go")}
          subtitle={t("components.make-sure-everyone-is-free")}
          center
        />
        <DateRangePicker
          onChange={(item: any) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={dateRange as any}
          direction="horizontal"
          rangeColors={["#f43f5e"]}
        />
      </div>
    );
  }

  if (step === SearchModalOptions.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.more-information")}
          subtitle={t("components.find-your-perfect-place")}
          center
        />
        <Counter
          onChange={(value: number) => setGuest(value)}
          value={guest}
          title={t("general.guests")}
          subtitle={t("components.how-many-guests-are-coming")}
        />
        <hr />
        <Counter
          onChange={(value: number) => setBedCount(value)}
          value={num_bed}
          title={t("general.beds")}
          subtitle={t("components.how-many-beds-per-room-do-you-need")}
        />
      </div>
    );
  }

  if (step === SearchModalOptions.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.price-range-you-want")}
          subtitle={t("components.find-an-expense-that-right-for-you")}
          center
        />
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
    );
  }

  return (
    <FiltersModal
      isOpen={searchModel.isOpen}
      onClose={searchModel.onClose}
      onSubmit={onSubmit}
      // secondaryAction={step === SearchModalOptions.LOCATION ? undefined : onBack}
      // secondaryActionLabel={secondActionLabel}
      actionLabel={actionLabel}
      body={bodyContent}
      reset={undefined}
    />
  );
}

export default SearchModal;
