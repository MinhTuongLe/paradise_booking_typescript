/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import qs from "query-string";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Button from "@/components/Button";
import PostGuiderCardHorizontal from "@/components/post-guiders/PostGuiderCardHorizontal";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import { PostGuider } from "@/models/post";
import { PostGuiderType } from "@/enum";

function PostGuidersClient({ data }: { data: PostGuider[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const latParams = params?.get("lat");
  const lngParams = params?.get("lng");
  const { t } = useTranslation("translation", { i18n });

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isShowLocation, setIsShowLocation] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const locationFilterSection = useRef<HTMLDivElement>(null);
  const locationPickerSection = useRef<HTMLDivElement>(null);

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
      lat,
      lng,
    };

    const url = qs.stringifyUrl(
      {
        url: "/post-guiders",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [location, router, params, lat, lng]);

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

  const locationLabel = useMemo(() => {
    if (latParams && lngParams) {
      return `(${parseInt(latParams)}, ${parseInt(lngParams)})`;
    }
  }, [latParams, lngParams]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  const handleClear = () => {
    const url = qs.stringifyUrl({
      url: "/post-guiders",
      query: {},
    });
    router.push(url);
  };

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

  return (
    <Container>
      <div className="mt-14 flex justify-between items-center w-full">
        <Heading
          title="New Post Guiders"
          subtitle="Guiders will tell you the information about them to make your trip more attractive"
          start
        />
        <div className="flex space-x-6 w-[50%] justify-end">
          <div className="relative">
            <div
              onClick={scrollToLocationFilterSection}
              ref={locationFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              {locationLabel || t("general.anywhere")}
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
            <Button label={t("general.filter")} onClick={onSubmit} medium />
          </div>
          <div className="w-[100px] flex justify-between items-center">
            <Button
              outline={true}
              label={t("general.clear")}
              onClick={handleClear}
              medium
            />
          </div>
        </div>
      </div>
      <div className="mt-10 gap-8 flex flex-nowrap overflow-x-scroll no-scrollbar">
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.ArtAndCulture} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.Entertainment} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.FoodAndDrink} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.Sightseeing} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.Sports} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.Tours} />
        </div>
        <div className="w-[30%] flex-shrink-0">
          <PostGuiderCardHorizontal value={PostGuiderType.Wellness} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {data?.map((item: PostGuider) => {
          return (
            <div key={item.id}>
              <PostGuiderCardVertical data={item} />
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default PostGuidersClient;
