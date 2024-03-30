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
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";

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
            <span
              onClick={() => setSelected(0)}
              className="text-rose-500 text-md cursor-pointer hover:font-bold hover:underline hover:underline-offset-2"
            >
              Home
            </span>
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
          <div className="border-[1px] py-4 px-3 flex justify-between items-center">
            <div>
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
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-between items-center w-full">
        <div className="flex items-center w-[75%] space-x-32">
          <div className="space-y-2">
            <div className="font-bold text-[16px]">Booked guiders status</div>
            {/* <Listbox
              value={selected}
              onChange={(e) => {
                setSelected(e);
                setSelectedStatuses((prevState) => {
                  if (e === booking_status[0]) {
                    return [booking_status[0]];
                  }
                  if (prevState.includes(e)) {
                    return prevState;
                  }
                  return [...prevState, e];
                });
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button className="relative w-[180px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        {selected?.icon && (
                          <>
                            {React.createElement(selected.icon, {
                              size: 24,
                              className: `text-${selected.color}`,
                              color: selected.color,
                            })}
                          </>
                        )}
                        <span className="ml-3 block truncate">
                          {selected.name}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {booking_status.map((person) => (
                          <Listbox.Option
                            key={person.id}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-rose-100" : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={person}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <div>
                                    {person?.icon && (
                                      <>
                                        {React.createElement(person.icon, {
                                          size: 24,
                                          className: `text-${person.color}`,
                                          color: person.color,
                                        })}
                                      </>
                                    )}
                                  </div>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {person.name}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active
                                        ? "text-gray-900"
                                        : "text-rose-500",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox> */}
          </div>
          <div className="flex items-center space-x-8">
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
          <div className="flex items-center space-x-8">
            <div className="space-y-2">
              <div className="font-bold text-[16px]">From time</div>
              <Input
                id="time_from"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="time"
              />
            </div>
            <div className="space-y-2">
              <div className="font-bold text-[16px]">To time</div>
              <Input
                id="time_to"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="time"
              />
            </div>
          </div>
        </div>
        {/* <div className="w-[25%] flex justify-between items-center space-x-8">
          <Button
            outline={true}
            disabled={isLoading}
            label="Clear All"
            onClick={handleSubmit(handleClearAllFilters)}
          />
          <Button
            disabled={isLoading}
            label="Filter"
            onClick={handleSubmit(handleFilter)}
          />
        </div> */}
      </div>
      {/* <div className="mt-4">
        {selectedStatuses?.length > 0 &&
          selectedStatuses[0] !== booking_status[0] && (
            <div className="flex space-x-4">
              {selectedStatuses.map((item: PlaceStatus) => (
                <div
                  key={item.id}
                  className="relative cursor-default select-none py-2 pl-3 pr-9 rounded-xl border-[1px]"
                  // value={item}
                  style={{
                    borderColor: item.color,
                  }}
                >
                  <>
                    <div className="flex items-center">
                      {item?.icon && (
                        <>
                          {React.createElement(item.icon, {
                            size: 24,
                            className: `text-${item.color}`,
                            color: item.color,
                          })}
                        </>
                      )}
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div
                      className="absolute top-1 right-1 cursor-pointer hover:text-rose-500"
                      onClick={() => {
                        setSelected(place_status[0]);
                        setSelectedStatuses((prevState) =>
                          prevState.filter((state) => state !== item)
                        );
                      }}
                    >
                      <IoMdClose size={16} />
                    </div>
                  </>
                </div>
              ))}
            </div>
          )}
      </div> */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
        <BookedGuiderCard onDelete={() => onDelete(item)} />
      </div>
      {/* {!isLoading ? (
        reservations && reservations.data?.data?.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {reservations.data.data.map((item: Reservation) => {
              return (
                <div key={item.id}>
                    <ReservationItem
                      onDelete={() => onDelete(item)}
                      data={item}
                    />
                  </div>
                );
              })}
            </div>
            {reservations.paging?.total &&
              Number(reservations.paging.total) > LIMIT && (
                <PaginationComponent
                  page={Number(params?.get("page")) || 1}
                  total={reservations.paging?.total || LIMIT}
                  limit={reservations.paging?.limit || LIMIT}
                />
              )}
          </>
        ) : (
          <div className="mt-12 space-y-4">
            <span className="text-[24px] font-bold">
              You don't have any reservation to display
            </span>
            <div className="max-w-[160px]">
              <Button label="Booking now" onClick={() => router.push("/")} />
            </div>
          </div>
        )
      ) : (
        <Loader />
      )} */}
    </Container>
  );
}

export default InteractionDiaryClient;
