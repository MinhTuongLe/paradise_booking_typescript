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
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ReservationItem from "@/components/ReservationItem";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import {
  API_URL,
  LIMIT,
  booking_status,
  classNames,
  emptyAvatar,
  place_status,
} from "@/const";
import Loader from "@/components/Loader";
import PaginationComponent from "@/components/PaginationComponent";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { PlaceStatus, Reservation, Reservations } from "@/models/place";
import { FilterReservationDataSubmit, Pagination } from "@/models/api";
import { RootState } from "@/store/store";
import BookedGuiderCard from "@/components/post-guiders/BookedGuiderCard";
import { FaCommentAlt } from "react-icons/fa";
import { MdCancel, MdKeyboardArrowRight } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import Image from "next/image";

function InteractionDiaryClient() {
  const router = useRouter();
  const params = useSearchParams();
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const [item, setItem] = useState<Reservation>();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<
    | Reservations
    | {
        data: { data: Reservation[] };
        paging: Pagination;
      }
  >();
  const [selected, setSelected] = useState<number>(0);
  const [selectedStatuses, setSelectedStatuses] = useState<PlaceStatus[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date_from: "",
      date_to: "",
      statuses: selected,
    },
  });

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

  const onDelete = (item: any) => {
    setItem(item);
    setOpen(true);
  };

  const handleDelete = async () => {
    // if (
    //   item &&
    //   item.status_id !== 5 &&
    //   item.status_id !== 6 &&
    //   item.status_id !== 1
    // ) {
    //   toast.error(`Delete failed. This reservation is processing`);
    //   setOpen(false);
    //   return;
    // }
    // setIsLoading(true);
    // const accessToken = Cookie.get("accessToken");
    // if (!item) return;
    // if (item.status_id === 1) {
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     params: {
    //       id: item.id,
    //     },
    //   };
    //   try {
    //     setOpen(false);
    //     const res = await axios.post(`${API_URL}/cancel_booking`, null, config);
    //     if (res.data.data) {
    //       await getReservations();
    //       toast.success(`Cancel reservation successfully`);
    //     } else {
    //       toast.error("Cancel reservation failed");
    //     }
    //   } catch (error) {
    //     toast.error("Cancel reservation failed");
    //   }
    //   setIsLoading(false);
    // } else {
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   };
    //   try {
    //     setOpen(false);
    //     const res = await axios.delete(
    //       `${API_URL}/bookings/${item.id}`,
    //       config
    //     );
    //     if (res.data.data) {
    //       await getReservations();
    //       toast.success(`Delete reservation successfully`);
    //     } else {
    //       toast.error("Delete reservation failed");
    //     }
    //   } catch (error) {
    //     toast.error("Delete reservation failed");
    //   }
    // }
    // setIsLoading(false);
  };

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
  //   if (authState && loggedUser?.role !== 3) getReservations();
  // }, [params]);

  // if (!authState || loggedUser?.role === 3) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }

  return (
    <Container>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        content="booked guider"
      />
      <div className="grid grid-cols-3 mt-10 gap-12">
        <div className="col-span-1 border-r-[1px] px-6 space-y-6">
          <div className="flex justify-between items-center">
            <Heading title="Interaction Diary" start />
            {selected !== 0 && (
              <span
                onClick={() => setSelected(0)}
                className="text-rose-500 text-md cursor-pointer hover:font-bold hover:underline hover:underline-offset-2"
              >
                Home
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                placeholder="Search in interaction diary..."
                // value={searchValue}
                // onChange={handleInputChange}
              />
              <button
                // onClick={() => handleFormSubmit(false)}
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
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="font-bold text-[16px]">From date</div>
              <Input
                id="date_from"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="date"
              />
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[16px]">To date</div>
              <Input
                id="date_to"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="date"
              />
            </div>
          </div>
          <hr />
          <div>
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-[#f5f5f5] py-2 px-3"
              onClick={() => setSelected(1)}
            >
              <div className="flex space-x-4 items-center">
                <div className="bg-white rounded-full border-[1px] border-rose-500 border-solid w-10 h-10 flex justify-center items-center">
                  <AiFillLike size={24} className="text-rose-500 " />
                </div>
                <span
                  className={`font-bold text-lg ${
                    selected === 1 ? "text-rose-500" : "text-[#222]"
                  }`}
                >
                  Like
                </span>
              </div>
              <div>
                <MdKeyboardArrowRight
                  size={32}
                  className={`${
                    selected === 1 ? "text-rose-500" : "text-[#222]"
                  }`}
                />
              </div>
            </div>
            <hr className="my-2" />

            <div
              className="flex justify-between items-center cursor-pointer hover:bg-[#f5f5f5] py-2 px-3"
              onClick={() => setSelected(2)}
            >
              <div className="flex space-x-4 items-center">
                <div className="bg-white rounded-full border-[1px] border-rose-500 border-solid w-10 h-10 flex justify-center items-center">
                  <FaCommentAlt size={20} className="text-rose-500 " />
                </div>
                <span
                  className={`font-bold text-lg ${
                    selected === 2 ? "text-rose-500" : "text-[#222]"
                  }`}
                >
                  Comment
                </span>
              </div>
              <div>
                <MdKeyboardArrowRight
                  size={32}
                  className={`${
                    selected === 2 ? "text-rose-500" : "text-[#222]"
                  }`}
                />
              </div>
            </div>
            <hr className="my-2" />
          </div>
        </div>
        <div className="col-span-2 px-6">
          <Heading
            title={
              (selected === 0 && "All") ||
              (selected === 1 && "Like") ||
              (selected === 2 && "Comment") ||
              "-"
            }
            start
          />
          <div className="space-y-4 mt-6">
            <div className="border-[1px] py-4 px-6 flex justify-between items-center rounded-xl">
              <div className="flex space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer"
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <span className="font-semibold">All</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-400">
                <MdCancel />
                <span className="font-semibold">Delete</span>
              </div>
            </div>

            <div className="border-[1px] py-4 px-6 rounded-xl">
              <span className="font-semibold">30/03/2024</span>
              <div className="flex justify-start items-center mt-2 space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer "
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <div className="flex space-x-4 w-full">
                  <div className="flex justify-start items-center space-x-4 w-full">
                    <Image
                      width={60}
                      height={60}
                      src={emptyAvatar}
                      alt="Avatar"
                      className="rounded-full h-[60px] w-[60px]"
                      priority
                    />
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex space-x-1">
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Le Minh Tuong
                            </span>
                            <span>commented about post of </span>
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Paradise
                            </span>
                          </div>
                          <span>Content of Le Minh Tuong's comment</span>
                        </div>
                        <MdCancel
                          size={32}
                          className="text-rose-500 cursor-pointer hover:brightness-150"
                        />
                      </div>
                      <span>00:00:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-start items-center mt-2 space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer "
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <div className="flex space-x-4 w-full">
                  <div className="flex justify-start items-center space-x-4 w-full">
                    <Image
                      width={60}
                      height={60}
                      src={emptyAvatar}
                      alt="Avatar"
                      className="rounded-full h-[60px] w-[60px]"
                      priority
                    />
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex space-x-1">
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Le Minh Tuong
                            </span>
                            <span>commented about post of </span>
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Paradise
                            </span>
                          </div>
                          <span>Content of Le Minh Tuong's comment</span>
                        </div>
                        <MdCancel
                          size={32}
                          className="text-rose-500 cursor-pointer hover:brightness-150"
                        />
                      </div>
                      <span>00:00:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-[1px] py-4 px-6 rounded-xl">
              <span className="font-semibold">30/03/2024</span>
              <div className="flex justify-start items-center mt-2 space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer "
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <div className="flex space-x-4 w-full">
                  <div className="flex justify-start items-center space-x-4 w-full">
                    <Image
                      width={60}
                      height={60}
                      src={emptyAvatar}
                      alt="Avatar"
                      className="rounded-full h-[60px] w-[60px]"
                      priority
                    />
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex space-x-1">
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Le Minh Tuong
                            </span>
                            <span>commented about post of </span>
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Paradise
                            </span>
                          </div>
                          <span>Content of Le Minh Tuong's comment</span>
                        </div>
                        <MdCancel
                          size={32}
                          className="text-rose-500 cursor-pointer hover:brightness-150"
                        />
                      </div>
                      <span>00:00:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-start items-center mt-2 space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer "
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <div className="flex space-x-4 w-full">
                  <div className="flex justify-start items-center space-x-4 w-full">
                    <Image
                      width={60}
                      height={60}
                      src={emptyAvatar}
                      alt="Avatar"
                      className="rounded-full h-[60px] w-[60px]"
                      priority
                    />
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex space-x-1">
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Le Minh Tuong
                            </span>
                            <span>commented about post of </span>
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Paradise
                            </span>
                          </div>
                          <span>Content of Le Minh Tuong's comment</span>
                        </div>
                        <MdCancel
                          size={32}
                          className="text-rose-500 cursor-pointer hover:brightness-150"
                        />
                      </div>
                      <span>00:00:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-start items-center mt-2 space-x-4">
                <input
                  id={`type-${1}`}
                  name="type"
                  type="checkbox"
                  className="w-6 h-6 rounded-full cursor-pointer "
                  // onChange={(e) =>
                  //   handleAmenityCheckboxChange(e, item)
                  // }
                  // defaultChecked={isChecked}
                />
                <div className="flex space-x-4 w-full">
                  <div className="flex justify-start items-center space-x-4 w-full">
                    <Image
                      width={60}
                      height={60}
                      src={emptyAvatar}
                      alt="Avatar"
                      className="rounded-full h-[60px] w-[60px]"
                      priority
                    />
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex space-x-1">
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Le Minh Tuong
                            </span>
                            <span>like</span>
                            <span className="cursor-pointer text-md font-bold hover:text-rose-500 hover:underline hover:underline-offset-2">
                              Paradise
                            </span>
                          </div>
                        </div>
                        <MdCancel
                          size={32}
                          className="text-rose-500 cursor-pointer hover:brightness-150"
                        />
                      </div>
                      <span>00:00:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default InteractionDiaryClient;
