/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { DateRangePicker } from "react-date-range";
import Image from "next/image";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ReservationItem from "@/components/ReservationItem";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import {
  API_URL,
  LIMIT,
  Topic,
  booking_status,
  classNames,
  maxPrice,
  max_guest_selections,
  place_status,
  post_review_types,
  type_selections,
} from "@/const";
import Loader from "@/components/Loader";
import PaginationComponent from "@/components/PaginationComponent";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {
  DateRange,
  PlaceStatus,
  Reservation,
  Reservations,
} from "@/models/place";
import { FilterReservationDataSubmit, Pagination } from "@/models/api";
import { RootState } from "@/store/store";
import PostReviewCardHorizontal from "@/components/post-reviews/PostReviewCardHorizontal";
import PostReviewCardVertical from "@/components/post-reviews/PostReviewCardVertical";
import { getTopicValue } from "@/utils/getTopic";

function PostCollectionClient() {
  // const router = useRouter();
  // const params = useSearchParams();
  // const [item, setItem] = useState<Reservation>();
  // const [open, setOpen] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowMaxGuest, setIsShowMaxGuest] = useState(false);
  const [isShowType, setIsShowType] = useState(false);
  const [maxGuests, setMaxGuests] = useState<number | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<number>(Topic.Dining);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(maxPrice);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);
  const maxGuestFilterSection = useRef<HTMLDivElement>(null);
  const maxGuestPickerSection = useRef<HTMLDivElement>(null);
  const typeFilterSection = useRef<HTMLDivElement>(null);
  const typePickerSection = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // const [reservations, setReservations] = useState<
  //   | Reservations
  //   | {
  //       data: { data: Reservation[] };
  //       paging: Pagination;
  //     }
  // >();
  // const [selected, setSelected] = useState<PlaceStatus>(booking_status[0]);
  // const [selectedStatuses, setSelectedStatuses] = useState<PlaceStatus[]>([]);
  // const authState = useSelector(
  //   (state: RootState) => state.authSlice.authState
  // );
  // const loggedUser = useSelector(
  //   (state: RootState) => state.authSlice.loggedUser
  // );

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     date_from: "",
  //     date_to: "",
  //     statuses: selected,
  //   },
  // });

  // const handleFilter: SubmitHandler<FilterReservationDataSubmit> = async (
  //   data: FilterReservationDataSubmit
  // ) => {
  //   const statuses = selectedStatuses.map((item: PlaceStatus) => item.id);
  //   const submitValues = {
  //     ...data,
  //     date_from: data.date_from.split("-").reverse().join("-"),
  //     date_to: data.date_to.split("-").reverse().join("-"),
  //     statuses,
  //   };
  //   getReservations(submitValues);
  // };

  // const handleClearAllFilters = () => {
  //   reset();
  //   setSelected(place_status[0]);
  //   setSelectedStatuses([]);
  //   getReservations();
  // };

  // const onDelete = (item: Reservation) => {
  //   setItem(item);
  //   setOpen(true);
  // };

  // const handleDelete = async () => {
  //   if (
  //     item &&
  //     item.status_id !== 5 &&
  //     item.status_id !== 6 &&
  //     item.status_id !== 1
  //   ) {
  //     toast.error(`Delete failed. This reservation is processing`);
  //     setOpen(false);
  //     return;
  //   }

  //   setIsLoading(true);
  //   const accessToken = Cookie.get("accessToken");

  //   if (!item) return;

  //   if (item.status_id === 1) {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         id: item.id,
  //       },
  //     };

  //     try {
  //       setOpen(false);
  //       const res = await axios.post(`${API_URL}/cancel_booking`, null, config);
  //       if (res.data.data) {
  //         await getReservations();
  //         toast.success(`Cancel reservation successfully`);
  //       } else {
  //         toast.error("Cancel reservation failed");
  //       }
  //     } catch (error) {
  //       toast.error("Cancel reservation failed");
  //     }
  //     setIsLoading(false);
  //   } else {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     };

  //     try {
  //       setOpen(false);
  //       const res = await axios.delete(
  //         `${API_URL}/bookings/${item.id}`,
  //         config
  //       );
  //       if (res.data.data) {
  //         await getReservations();
  //         toast.success(`Delete reservation successfully`);
  //       } else {
  //         toast.error("Delete reservation failed");
  //       }
  //     } catch (error) {
  //       toast.error("Delete reservation failed");
  //     }
  //   }
  //   setIsLoading(false);
  // };

  // const getReservations = async (
  //   filterValues?:
  //     | FilterReservationDataSubmit
  //     | {
  //         date_from: string;
  //         date_to: string;
  //         statuses: number[];
  //       }
  //     | undefined
  // ) => {
  //   setIsLoading(true);
  //   const accessToken = Cookie.get("accessToken");
  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     params: {
  //       page: params?.get("page") || 1,
  //       limit: params?.get("limit") || LIMIT,
  //     },
  //   };

  //   await axios
  //     .post(`${API_URL}/booking_list`, filterValues || null, config)
  //     .then((response) => {
  //       setReservations(response.data);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       toast.error("Something Went Wrong");
  //       setIsLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (authState && loggedUser?.role !== getRoleId(Role.Admin)) getReservations();
  // }, [params]);

  // if (!authState || loggedUser?.role === getRoleId(Role.Admin)) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }

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

  const scrollToTypeFilterSection = () => {
    if (typeFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        typeFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowType((prev) => !prev);
    }
  };

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxPrice - 0 >= 1000 && maxPrice <= maxPrice) {
      if (parseInt(e.target.value) > maxPrice) {
      } else {
        setMinValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) < 0) {
        setMinValue(parseInt(e.target.value));
      }
    }
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxPrice - 0 >= 1000 && maxPrice <= maxPrice) {
      if (parseInt(e.target.value) < 0) {
      } else {
        setMaxValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) > maxPrice) {
        setMaxValue(parseInt(e.target.value));
      }
    }
  };

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
    const handleClickOutside2 = (event: MouseEvent) => {
      if (
        maxGuestFilterSection.current &&
        !maxGuestFilterSection.current.contains(event.target as Node) &&
        maxGuestPickerSection.current &&
        !maxGuestPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowMaxGuest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [maxGuestFilterSection, maxGuestPickerSection]);

  useEffect(() => {
    const handleClickOutside3 = (event: MouseEvent) => {
      if (
        typeFilterSection.current &&
        !typeFilterSection.current.contains(event.target as Node) &&
        typePickerSection.current &&
        !typePickerSection.current.contains(event.target as Node)
      ) {
        setIsShowType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside3);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside3);
    };
  }, [typeFilterSection, typePickerSection]);

  useEffect(() => {
    if (!isShowMaxGuest) setMaxGuests(undefined);
  }, [isShowMaxGuest]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.left = (0 / maxPrice) * 100000 + "%";
      progressRef.current.style.right =
        100000 - (maxPrice / maxPrice) * 100000 + "%";
    }
  }, [maxPrice]);

  return (
    <Container notPadding={true}>
      <div className="aspect-video w-full relative h-[60vh]">
        <Image
          fill
          className="object-cover h-full w-full"
          src={
            "https://a0.muscache.com/im/pictures/e35bb307-05f4-48a4-bdc5-3b2198bb9451.jpg?im_w=1440"
          }
          alt="listing"
          priority
        />
      </div>
      <div className="xl:px-20 md:px-2 sm:px-2 px-4">
        <div className="flex mt-6">
          <div className="w-[25%] relative flex gap-4 mr-6">
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder="Search Place ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              // onClick={() => getPlaces(searchValue)}
              className="text-white absolute end-0 bg-rose-500 hover:bg-rose-600 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 top-0 bottom-0"
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="relative mr-6">
            <div
              onClick={scrollToRateRangeFilterSection}
              ref={dateRangeFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              Date range
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
          <div className="relative mr-6">
            <div
              onClick={scrollToMaxGuestFilterSection}
              ref={maxGuestFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              Max guests
            </div>
            <div
              ref={maxGuestPickerSection}
              className={`${
                !isShowMaxGuest
                  ? "hidden"
                  : "absolute top-[100%] left-0 z-10 w-[20vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
              }`}
            >
              <div className="p-4">
                {max_guest_selections.map((number, index) => {
                  return (
                    <div key={index} onClick={() => setMaxGuests(number.value)}>
                      <div className="w-full flex justify-start items-center cursor-pointer space-x-2 py-3 px-2">
                        <input
                          id={`number-${index}`}
                          name="number"
                          type="radio"
                          value={number.value}
                          className="w-5 h-5 rounded-full cursor-pointer"
                          checked={number.value === maxGuests}
                        />
                        <label
                          htmlFor={`number-${index}`}
                          className="text-md text-zinc-600 font-thin cursor-pointer"
                        >
                          {number.name}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
              <div className="flex justify-between py-4 px-3">
                <span
                  className={`font-normal underline  ${
                    maxGuests === undefined
                      ? "text-zinc-300 cursor-not-allowed"
                      : "text-[#222] cursor-pointer"
                  }`}
                >
                  Clear
                </span>
                <div className="w-[80px]">
                  <Button
                    label="Save"
                    medium
                    onClick={() => {
                      console.log("max guests: ", maxGuests);
                      setIsShowMaxGuest(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <span className="w-[80px] flex items-center justify-end">
            {minValue || 0}
          </span>
          <div className="flex items-center w-[15vw] mx-4">
            <div className="w-full">
              <div className="slider relative h-1 rounded-md bg-gray-300">
                <div
                  className="progress absolute h-1 bg-[#82cdff] rounded"
                  ref={progressRef}
                ></div>
              </div>

              <div className="range-input relative w-full">
                <input
                  onChange={handleMin}
                  type="range"
                  min={0}
                  step={100000}
                  max={maxPrice}
                  value={minValue}
                  className="range-min absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
                />

                <input
                  onChange={handleMax}
                  type="range"
                  min={0}
                  step={100000}
                  max={maxPrice}
                  value={maxValue}
                  className="range-max absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
                />
              </div>
            </div>
          </div>
          <span className="w-[80px] flex items-center justify-start">
            {maxValue || maxPrice}
          </span>
          <div className="relative ml-6">
            <div
              onClick={scrollToTypeFilterSection}
              ref={typeFilterSection}
              className="h-[38px] bg-white border-[1px] border-[#f2f2f2] rounded-2xl w-[160px] px-4 py-1 flex items-center justify-center cursor-pointer hover:border-[#222]"
            >
              {type_selections.find((item) => item.value === selectedType)
                ?.name || "For you"}
            </div>
            <div
              ref={typePickerSection}
              className={`${
                !isShowType
                  ? "hidden"
                  : "absolute top-[100%] right-0 z-10 w-[15vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
              }`}
            >
              <div className="p-4">
                {type_selections.map((number, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedType(number.value);
                        setIsShowType(false);
                      }}
                    >
                      <div className="w-full flex justify-start items-center cursor-pointer space-x-2 py-3 px-2">
                        <input
                          id={`number-${index}`}
                          name="number"
                          type="radio"
                          value={number.value}
                          className="w-5 h-5 rounded-full cursor-pointer"
                          checked={number.value === selectedType}
                        />
                        <label
                          htmlFor={`number-${index}`}
                          className="text-md text-zinc-600 font-thin cursor-pointer"
                        >
                          {number.name}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
          <PostReviewCardVertical />
        </div>
      </div>
    </Container>
  );
}

export default PostCollectionClient;
