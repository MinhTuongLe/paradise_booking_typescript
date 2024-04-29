/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import React, { Fragment, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { API_URL, classNames, post_guider_types } from "@/const";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import useCheckAvailableModal from "../../../hook/useCheckAvailableModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { User } from "@/models/user";
import { Place } from "@/models/place";
import { RootState } from "@/store/store";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import useAddNewPostGuiderModal from "@/hook/useAddNewPostGuiderModal";
import { PostGuider } from "@/models/post";
import { PostGuiderType } from "@/enum";

function MyPostGuidersClient({ data }: { data: PostGuider[] | undefined }) {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const checkAvailableModal = useCheckAvailableModal();
  const addNewPostGuider = useAddNewPostGuiderModal();
  const [selected, setSelected] = useState<{
    name: string;
    value: PostGuiderType;
    image: any;
    description: string;
  } | null>(null);

  const onDelete = (id: number) => {
    // setId(id);
    // setOpen(true);
  };

  const handleDelete = async () => {
    // setIsLoading(true);
    // setOpen(false);
    // const accessToken = Cookie.get("accessToken");
    // const config = {
    //   params: {
    //     id: id,
    //   },
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // };
    // try {
    //   const res = await axios.delete(`${API_URL}/places`, config);
    //   if (res.data.data) {
    //     await getPlaces("");
    //     toast.success(`Delete room successfully`);
    //   } else toast.error("Delete room failed");
    // } catch (error) {
    //   toast.error("Delete room failed");
    // }
    // setIsLoading(false);
  };

  // const getPlaces = async (searchValue: string) => {
  //   setIsLoading(true);
  //   const accessToken = Cookie.get("accessToken");
  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     params: {
  //       vendor_id: currentUser?.id,
  //       place_id: searchValue ? searchValue : 0,
  //     },
  //   };

  //   await axios
  //     .get(`${API_URL}/bookings_list/manage_reservation`, config)
  //     .then((response) => {
  //       setPlaces(response?.data?.data?.data || []);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setPlaces([]);
  //       setIsLoading(false);
  //     });
  // };

  const handleClear = () => {
    setSearchValue("");
    // getPlaces("");
  };

  // useEffect(() => {
  //   getPlaces(searchValue);
  // }, []);

  // if (loggedUser?.id !== currentUser?.id) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  return (
    <Container>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        content="property"
      />
      <div className="mt-10 mb-6">
        <Heading title="Properties" subtitle="List of your properties" start />
      </div>
      <div className="flex items-start justify-between space-x-8">
        <div className="w-[70%] flex justify-start space-x-8">
          <div className="w-[30%]">
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
          </div>
          <div className="w-[10%] flex justify-between items-center">
            <Button
              outline={true}
              disabled={isLoading}
              label="Clear"
              onClick={handleClear}
              medium
            />
          </div>
        </div>
        <div className="w-[30%] flex justify-between items-center space-x-8">
          <div className=" flex-1">
            <Listbox
              value={selected}
              onChange={(e) => {
                setSelected(e);
                // setSelectedStatuses((prevState) => {
                //   if (e === booking_status[0]) {
                //     return [booking_status[0]];
                //   }
                //   if (prevState.includes(e)) {
                //     return prevState;
                //   }
                //   return [...prevState, e];
                // });
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {selected
                            ? t(`post-guider-types.${selected?.name}`)
                            : t("place-status.all")}
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
                        {post_guider_types.map((type) => (
                          <Listbox.Option
                            key={type.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-rose-100" : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={type}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {t(`post-guider-types.${type.name}`)}
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
            </Listbox>
          </div>
          <div className="w-1/3">
            <Button
              label="Add new"
              onClick={() => addNewPostGuider.onOpen()}
              medium
            />
          </div>
        </div>
      </div>
      {/* {!isLoading ? (
        places && places.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {places.map((listing) => (
              <ListingCard
                key={listing.id}
                data={listing}
                actionId={listing.id}
                onAction={onDelete}
                actionLabel="Delete property"
                currentUser={currentUser}
                shrink={true}
                disabled={listing?.is_booked}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Properties found"
            subtitle="Looks like you have not any Properties"
          />
        )
      ) : (
        <Loader />
      )} */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {data?.map((item: PostGuider) => {
          return (
            <div key={item.id}>
              <PostGuiderCardVertical data={item} mine={true} />
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default MyPostGuidersClient;
