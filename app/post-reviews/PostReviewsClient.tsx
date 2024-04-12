/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { DateRangePicker } from "react-date-range";
import qs from "query-string";
import dayjs from "dayjs";
import { parse, differenceInDays } from "date-fns";
import dynamic from "next/dynamic";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Button from "@/components/Button";
import { formatDateType } from "@/const";
import { DateRange } from "@/models/place";
import PostReviewCardHorizontal from "@/components/post-reviews/PostReviewCardHorizontal";
import PostReviewCardVertical from "@/components/post-reviews/PostReviewCardVertical";
import { Topic } from "@/enum";
import { PostReview } from "@/models/post";

function PostReviewsClientClient({ data }: { data: PostReview[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const latParams = params?.get("lat");
  const lngParams = params?.get("lng");
  const startDate = params?.get("date_from");
  const endDate = params?.get("date_to");

  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowLocation, setIsShowLocation] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [searchResult, setSearchResult] = useState<any>(null);

  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);
  const locationFilterSection = useRef<HTMLDivElement>(null);
  const locationPickerSection = useRef<HTMLDivElement>(null);

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

  const scrollToLocationFilterSection = () => {
    if (locationFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        locationFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowLocation((prev) => !prev);
    }
  };

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

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
        locationFilterSection.current &&
        !locationFilterSection.current.contains(event.target as Node) &&
        locationPickerSection.current &&
        !locationPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowLocation(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationFilterSection, locationPickerSection]);

  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  const onSubmit = useCallback(async () => {
    let updatedQuery = {};
    let currentQuery;

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      date_from: dayjs(dateRange[0].startDate).format(formatDateType.YMD),
      date_to: dayjs(dateRange[0].endDate).format(formatDateType.YMD),
      lat,
      lng,
    };

    const url = qs.stringifyUrl(
      {
        url: "/post-reviews",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [location, router, dateRange, params, lat, lng]);

  const handleClear = () => {
    const url = qs.stringifyUrl({
      url: "/post-reviews",
      query: {},
    });
    router.push(url);
  };

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = parse(startDate, "yyyy-MM-dd", new Date());
      const end = parse(endDate, "yyyy-MM-dd", new Date());

      let diff = differenceInDays(end, start);
      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Days`;
    }

    return "Any Week";
  }, [startDate, endDate, latParams, lngParams]);

  const locationLabel = useMemo(() => {
    if (latParams && latParams) {
      return `(${parseInt(latParams)}, ${parseInt(latParams)})`;
    }

    return "Anywhere";
  }, [latParams, latParams, startDate, endDate]);

  return (
    <Container>
      <div className="mt-14 flex justify-between items-center w-full">
        <Heading
          title="Post Reviews By Topics"
          subtitle="Reviews about catering, entertainment and other things"
          start
        />
        <div className="flex space-x-6 w-[50%] justify-end">
          <div className="relative">
            <div
              onClick={scrollToRateRangeFilterSection}
              ref={dateRangeFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              {durationLabel || "Date range"}
            </div>
            <div
              ref={dateRangePickerSection}
              className={`${
                !isShowDateRange
                  ? "hidden"
                  : "absolute top-[100%] left-0 z-10 w-[40vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
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
          <div className="relative">
            <div
              onClick={scrollToLocationFilterSection}
              ref={locationFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              {locationLabel}
            </div>
            <div
              ref={locationPickerSection}
              className={`${
                !isShowLocation
                  ? "hidden"
                  : "absolute top-[100%] right-0 z-10 w-[40vw] shadow-xl shadow-neutral-500 rounded-xl"
              }`}
            >
              <Map
                center={[lat || 51, lng || -0.09]}
                onSearchResult={handleSearchResult}
              />
            </div>
          </div>
          <div className="w-[100px] flex justify-between items-center">
            <Button label="Filter" onClick={onSubmit} medium />
          </div>
          <div className="w-[100px] flex justify-between items-center">
            <Button outline={true} label="Clear" onClick={handleClear} medium />
          </div>
        </div>
      </div>

      <div className="mt-10 gap-8 flex flex-nowrap overflow-x-scroll review-horizontal pb-1">
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Dining} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Entertainment} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Accommodation} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Transportation} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Shopping} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.Health} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostReviewCardHorizontal value={Topic.OtherServices} />
        </div>
      </div>

      {/* <div className="flex justify-between items-center mt-10">
        <span className="text-2xl font-bold">For you</span>
        <span className="text-lg font-semibold underline">Show all (10)</span>
      </div> */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {data?.map((item: PostReview) => {
          return (
            <div key={item.id}>
              <PostReviewCardVertical data={item} />
            </div>
          );
        })}
      </div>

      {/* <div className="flex justify-between items-center mt-10">
        <span className="text-2xl font-bold">Lastest</span>
        <span className="text-lg font-semibold underline">Show all (10)</span>
      </div> */}
      {/* <div className="mt-4 gap-8 flex flex-nowrap overflow-x-scroll review-horizontal pb-1">
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
      </div> */}

      {/* <div className="flex justify-between items-center mt-10">
        <span className="text-2xl font-bold">Popular</span>
        <span className="text-lg font-semibold underline">Show all (10)</span>
      </div> */}
      {/* <div className="mt-4 gap-8 flex flex-nowrap overflow-x-scroll review-horizontal pb-1">
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
        <div className="w-[20%] flex-shrink-0">
          <PostReviewCardVertical />
        </div>
      </div> */}
    </Container>
  );
}

export default PostReviewsClientClient;
