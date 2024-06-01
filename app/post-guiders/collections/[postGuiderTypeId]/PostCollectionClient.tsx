/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import qs from "query-string";
import dynamic from "next/dynamic";
import { differenceInDays, parse } from "date-fns";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Button from "@/components/Button";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import { PostGuider } from "@/models/post";
import { PostGuiderType } from "@/enum";
import {
  getPostGuiderTypeDescription,
  getPostGuiderTypeImage,
  getPostGuiderTypeName,
} from "@/utils/getPostGuiderType";

interface PostCollectionClientProps {
  topic: PostGuiderType;
  data: PostGuider[];
}

const PostCollectionClient: React.FC<PostCollectionClientProps> = ({
  topic,
  data,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const latParams = params?.get("lat");
  const lngParams = params?.get("lng");
  const startDate = params?.get("date_from");
  const endDate = params?.get("date_to");

  const [isShowLocation, setIsShowLocation] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);

  const locationFilterSection = useRef<HTMLDivElement>(null);
  const locationPickerSection = useRef<HTMLDivElement>(null);

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
      dynamic(() => import("../../../../components/Map"), {
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
        url: pathName || "/post-guiders",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [location, router, params, lat, lng]);

  const handleClear = () => {
    const url = qs.stringifyUrl({
      url: pathName || "/post-guiders",
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

      return `${diff} ${t("general.days")}`;
    }
  }, [startDate, endDate, latParams, lngParams]);

  const locationLabel = useMemo(() => {
    if (latParams && lngParams) {
      return `(${parseInt(latParams)}, ${parseInt(lngParams)})`;
    }
  }, [latParams, lngParams, startDate, endDate]);

  return (
    <Container notPadding={true}>
      <div className="aspect-video w-full relative h-[60vh]">
        <Image
          fill
          className="object-cover h-full w-full"
          src={getPostGuiderTypeImage(topic)}
          alt="listing"
          priority
        />
        <div className="absolute bottom-8 left-8 max-w-[60%] overflow-hidden">
          <div className="font-light text-white line-clamp-2 break-words text-[24px]">
            {t(`post-guider-types.${getPostGuiderTypeName(topic)}`)}
          </div>
          <div className="text-white line-clamp-2 break-words text-[36px] font-bold">
            {t(`post-guider-types.${getPostGuiderTypeDescription(topic)}`)}
          </div>
        </div>
      </div>
      <div className="xl:px-20 md:px-2 sm:px-2 px-4">
        <div className="flex justify-end mt-6 space-x-6">
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {data?.map((item: PostGuider) => {
            return (
              <div key={item.id}>
                <PostGuiderCardVertical data={item} />
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default PostCollectionClient;
