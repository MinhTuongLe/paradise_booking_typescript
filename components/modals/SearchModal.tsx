/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { formatISO, addDays } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import useSearchModal from "@/hook/useSearchModal";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import Modal from "./Modal";
import FiltersModal from "./FiltersModal";
import RangeSlider from "../RangeSlider";
import { maxPrice } from "@/const";
import { DateRange } from "@/models/place";

const STEPS = {
  LOCATION: 1,
  DATE: 2,
  INFO: 3,
  PRICE: 4,
};

function SearchModal({}) {
  const router = useRouter();
  const params = useSearchParams();
  const searchModel = useSearchModal();

  const [location, setLocation] = useState();
  const [step, setStep] = useState(searchModel.option);
  const [guest, setGuest] = useState(1);
  const [num_bed, setBedCount] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [lat, setLat] = useState(51);
  const [lng, setLng] = useState(-0.09);
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

  // const onNext = () => {
  //   setStep((value) => value + 1);
  // };

  const onSubmit = useCallback(async () => {
    // if (step !== STEPS.PRICE) {
    //   return onNext();
    // }

    let updatedQuery = {};

    // if (params) {
    //   currentQuery = qs.parse(params.toString());
    // }

    if (step === STEPS.LOCATION) {
      updatedQuery = {
        // ...currentQuery,
        lat: lat,
        lng: lng,
      };
    } else if (step === STEPS.DATE) {
      updatedQuery = {
        // ...currentQuery,
        date_from: formatISO(dateRange[0].startDate)
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-"),
        date_to: formatISO(dateRange[0].endDate)
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-"),
      };
    } else if (step === STEPS.INFO) {
      updatedQuery = {
        // ...currentQuery,
        guest: guest,
        num_bed: num_bed,
      };
    } else if (step === STEPS.PRICE) {
      updatedQuery = {
        // ...currentQuery,
        price_from: price_from,
        price_to: price_to,
      };
    }

    // if (dateRange.startDate) {
    //   updatedQuery.startDate = formatISO(dateRange.startDate).split("T")[0];
    // }

    // if (dateRange.endDate) {
    //   updatedQuery.endDate = formatISO(dateRange.endDate).split("T")[0];
    // }

    const url = qs.stringifyUrl(
      {
        url: "/",
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
    // if (step === STEPS.PRICE) {
    //   return "Search";
    // }
    // return "Next";
    return "Search";
  }, [step]);

  // const secondActionLabel = useMemo(() => {
  //   if (step === STEPS.LOCATION) {
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

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!"
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
          Location
        </label>
      </div>
      <Map center={[lat, lng]} onSearchResult={handleSearchResult} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
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

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect place!"
          center
        />
        <Counter
          onChange={(value: number) => setGuest(value)}
          value={guest}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <hr />
        <Counter
          onChange={(value: number) => setBedCount(value)}
          value={num_bed}
          title="Beds"
          subtitle="How many beds per room do you need?"
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Price range you want"
          subtitle="Find an expense that's right for you!"
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
      // secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      // secondaryActionLabel={secondActionLabel}
      actionLabel={actionLabel}
      body={bodyContent}
      reset={undefined}
    />
  );
}

export default SearchModal;
