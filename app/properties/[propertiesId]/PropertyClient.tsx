/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import React, { useEffect, useState, useMemo, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

import "../../../styles/globals.css";
import {
  API_URL,
  booking_status,
  classNames,
  offers,
  emptyAvatar,
} from "@/const";
import ImageUpload from "@/components/inputs/ImageUpload";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import { Amenity, Place, Reservation } from "@/models/place";
import { PlaceDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";

const steps = {
  GENERAL: 1,
  AMENITIES: 2,
  POLICIES: 3,
};

export interface PropertyClientProps {
  place: Place | undefined;
  reservations: Reservation[];
}

const PropertyClient: React.FC<PropertyClientProps> = ({
  place,
  reservations,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(steps.GENERAL);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [newSelectedAmenities, setNewSelectedAmenities] = useState<Amenity[]>(
    []
  );
  const [notSelectedAmenities, setNotSelectedAmenities] = useState<Amenity[]>(
    []
  );
  const [amenities, setAmenities] = useState([]);
  const [checkinTime, setCheckinTime] = useState<any>(undefined);
  const [checkoutTime, setCheckoutTime] = useState<any>(undefined);
  const [safePolicy, setSafePolicy] = useState("");
  const [cancelPolicy, setCancelPolicy] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      price_per_night: place?.price_per_night,
      name: place?.name,
      description: place?.description,
      address: place?.address,
      lat: place?.lat,
      lng: place?.lng,
      country: place?.country,
      state: place?.state,
      district: place?.district,
      cover: place?.cover || "",
      max_guest: place?.max_guest || 0,
      num_bed: place?.num_bed || 0,
      bed_room: place?.bed_room || 0,
    },
  });

  const cover = watch("cover");
  const [lat, setLat] = useState<number>(place?.lat || 51);
  const [lng, setLng] = useState<number>(place?.lng || -0.09);

  const setCustomValue = (id: any, value: File | null) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../../../components/Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  // function processSearchResult() {
  //   const numberRegex = /^[0-9]+$/;
  //   let country = place.country;
  //   let city = place.city;
  //   let address = place.address;
  //   if (searchResult) {
  //     const array = searchResult?.label.split(", ");

  //     if (array) {
  //       const length = array.length;
  //       country = array[length - 1];
  //       city = numberRegex.test(array[length - 2])
  //         ? array[length - 3]
  //         : array[length - 2];
  //       const temp = numberRegex.test(array[length - 2])
  //         ? array.slice(0, length - 3)
  //         : array.slice(0, length - 2);
  //       address = temp && temp.length > 1 ? temp.join(", ") : temp.join("");
  //     }
  //   }
  //   return { country, city, address };
  // }

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const accessToken = Cookie.get("accessToken");

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const imageUrl = "https://" + response.data.data.url;
      toast.success("Uploading photo successfully");
      return imageUrl;
    } catch (error) {
      toast.error("Uploading photo failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBookingStatus = (
    booking_id: number,
    status_id: number | string
  ) => {
    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const config = {
      params: {
        booking_id: booking_id,
        status: status_id,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .get(`${API_URL}/confirm_booking`, config)
      .then(() => {
        setIsLoading(false);
        toast.success("Update Booking Status Successfully");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Update Booking Status Failed");
        setIsLoading(false);
      });
  };

  const handleAmenityCheckboxChange = (e: any, item: Amenity) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setNewSelectedAmenities((prevAmenities) => [...prevAmenities, item]);
      setNotSelectedAmenities((prevAmenities) =>
        prevAmenities.filter((amenity) => amenity.name !== item.name)
      );
    } else {
      setNotSelectedAmenities((prevNotSelectedAmenities) => [
        ...prevNotSelectedAmenities,
        item,
      ]);
      setNewSelectedAmenities((prevAmenities) =>
        prevAmenities.filter((amenity) => amenity.name !== item.name)
      );
    }
  };

  const onSubmit: SubmitHandler<PlaceDataSubmit> = async (
    data: PlaceDataSubmit
  ) => {
    try {
      setIsLoading(true);

      if (currentStep === steps.GENERAL) {
        // upload photo
        let imageUrl: string | undefined = "";
        if (data?.cover) {
          const file = data.cover;
          if (typeof file === "string") {
            imageUrl = place?.cover;
          } else {
            imageUrl = await handleFileUpload(file);
          }
        }

        // const { country, city, address } = processSearchResult();

        const submitValues = {
          name: data?.name || "",
          description: data?.description || "",
          price_per_night: Number(data?.price_per_night) || 0,
          address: data?.address || place?.address,
          // city: city || place.city,
          // state: city || place.city,
          // country: country || place.country,
          lat: lat || place?.lat,
          lng: lng || place?.lng,
          cover: imageUrl || "",
          max_guest: Number(data?.max_guest) || place?.max_guest || 1,
          num_bed: Number(data?.num_bed) || place?.num_bed || 0,
          bed_room: Number(data?.bed_room) || place?.bed_room || 0,
        };

        const accessToken = Cookie.get("accessToken");
        const config = {
          params: {
            place_id: place?.id,
          },
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        axios
          .put(`${API_URL}/places`, submitValues, config)
          .then(() => {
            setIsLoading(false);
            toast.success("Update Room Successfully");
            router.refresh();
          })
          .catch((err) => {
            console.log(err);
            toast.error("Update Room Failed");
            setIsLoading(false);
          });
      } else if (currentStep === steps.AMENITIES) {
        const accessToken = Cookie.get("accessToken");
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const newItems = newSelectedAmenities.filter(
          (item) =>
            !selectedAmenities.some(
              (selectedItem: Amenity) => selectedItem.description === item.name
            )
        );

        const oldItems = notSelectedAmenities.filter((item) =>
          selectedAmenities.some(
            (selectedItem: Amenity) => selectedItem.description === item.name
          )
        );

        const submitValues = {
          place_id: place?.id,
          list_detail_amenity: newItems.map((item) => ({
            description: item.description || item.name,
            config_amenity_id: item.id,
          })),
        };

        const submitValues_2 = {
          place_id: place?.id,
          list_config_amenity_id: oldItems.map((item) => item.id),
        };

        const response_create = await axios.post(
          `${API_URL}/amenities`,
          submitValues,
          config
        );
        const response_remove = await axios.post(
          `${API_URL}/amenities/place/remove`,
          submitValues_2,
          config
        );

        if (
          response_create.data.data === true &&
          response_remove.data.data === true
        ) {
          toast.success("Update Amenities Successfully");
          await getAmenities();
          router.refresh();
        } else {
          toast.error("Update Amenities Failed");
        }

        setIsLoading(false);
      } else {
        console.log(checkinTime, checkoutTime, safePolicy, cancelPolicy);
        const submitValues = {
          place_id: place?.id,
          list_policy: [
            {
              group_policy_id: 1,
              name: `Checkin after: ${checkinTime}. Checkout before: ${checkoutTime}`,
            },
            {
              group_policy_id: 2,
              name: safePolicy,
            },
            {
              group_policy_id: 3,
              name: cancelPolicy,
            },
          ],
        };
        console.log(submitValues);
        const accessToken = Cookie.get("accessToken");
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        axios
          .post(`${API_URL}/policies`, { data: submitValues }, config)
          .then(() => {
            toast.success("Update Policies Successfully");
            router.refresh();
          })
          .catch((err) => {
            toast.error("Update Policies Failed");
          });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultAmenities = async () => {
    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    await axios
      .get(`${API_URL}/amenities/config`, config)
      .then((response) => {
        setAmenities(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getAmenities = async () => {
    setIsLoading(true);
    await axios
      .get(`${API_URL}/amenities/place/${place?.id}`)
      .then((response) => {
        setSelectedAmenities(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getPolicies = async () => {
    setIsLoading(true);

    await axios
      .get(`${API_URL}/policies/${place?.id}`)
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          if (response.data.data[0]?.name) {
            const houseRules = response.data.data[0]?.name;
            const regex = /(\d{1,2}:\d{2})/g;
            const matches = houseRules.match(regex);

            const checkinTime = matches[0];
            const checkoutTime = matches[1];

            setCheckinTime(checkinTime);
            setCheckoutTime(checkoutTime);
          }
          if (response.data.data[1]?.name)
            setSafePolicy(response.data.data[1]?.name);
          if (response.data.data[2]?.name)
            setCancelPolicy(response.data.data[2]?.name);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  const get = async () => {
    await getDefaultAmenities();
    await getAmenities();
  };

  useEffect(() => {
    if (currentStep === steps.AMENITIES) get();
    else if (currentStep === steps.POLICIES) getPolicies();
  }, [currentStep]);

  if (!authState || loggedUser?.role !== 2) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  } else if (!place) {
    return <EmptyState title="No data" subtitle="No place data to display" />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <h1 className="text-2xl font-bold mt-10 mb-4">
        {currentStep === steps.GENERAL ? (
          <>
            General Information
            {/* {" "}
            {place?.is_booked && (
              <span className="text-rose-500 font-extrabold">
                (Full of rooms)
              </span>
            )} */}
          </>
        ) : currentStep === steps.AMENITIES ? (
          "Amenities Information"
        ) : (
          "Policies Information"
        )}
      </h1>
      {currentStep === steps.GENERAL && (
        <>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <div className="pb-8 space-y-6">
                <Input
                  id="name"
                  label="Name"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <Input
                  id="description"
                  label="Description"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6">
                    <Input
                      id="max_guest"
                      label="Max Guest(s)"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      type="number"
                      required
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      id="price_per_night"
                      label="Price per Night"
                      formatPrice
                      type="number"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                    />
                  </div>
                </div>
                {!isLoading && (
                  <ImageUpload
                    onChange={(value: File | null) =>
                      setCustomValue("cover", value)
                    }
                    value={cover || ""}
                    fill={true}
                  />
                )}
                <div className="space-x-8">
                  <span
                    className="font-semibold text-[#222] text-lg underline cursor-pointer hover:text-rose-500"
                    onClick={() => setCurrentStep(steps.AMENITIES)}
                  >
                    Amenities Settings
                  </span>
                  <span
                    className="font-semibold text-[#222] text-lg underline cursor-pointer hover:text-rose-500"
                    onClick={() => setCurrentStep(steps.POLICIES)}
                  >
                    Policies Settings
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-6 space-y-6">
              {/* <Input
                id="num_bed"
                label="Bed(s)"
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              /> */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <Input
                    id="num_bed"
                    label="Bed(s)"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    type="number"
                    required
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    id="bed_room"
                    label="Bedroom(s)"
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                  />
                </div>
              </div>
              <Input
                id="address"
                label="Address"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <div className="w-full relative">
                <input
                  value={
                    searchResult
                      ? searchResult.label
                      : `${place?.district ? place?.district + ", " : ""} ${
                          place?.state ? place?.state + ", " : ""
                        } ${place?.country || "-"}`
                  }
                  id="_location"
                  readOnly={true}
                  className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 cursor-not-allowed border-neutral-300 focus:outline-none`}
                />
                <label
                  className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                >
                  District, State and Country
                </label>
              </div>
              <Map center={[lat, lng]} onSearchResult={handleSearchResult} />
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <Button
                    outline
                    label="Cancel"
                    onClick={() => {
                      reset();
                      router.push("/properties");
                    }}
                  />
                </div>
                <div className="col-span-6">
                  <Button
                    disabled={isLoading}
                    label="Update"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </div>
          </div>
          {reservations &&
            reservations?.map((item: Reservation, index: number) => {
              return (
                <div key={index} className="mt-16">
                  <hr />
                  <div className="mt-12">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[16px]">
                          {/* {`${
                            item.place?.address
                              ? item.place?.address + ", "
                              : ""
                          } ${item.place.city}, ${item.place.country}`} */}
                          {`${place?.address ? place?.address + ", " : ""} ${
                            place?.district ? place?.district + ", " : ""
                          } ${place?.state ? place?.state + ", " : ""} ${
                            place?.country || "-"
                          }`}
                        </span>
                        <span className="text-[#828080] font-bold">
                          Booking ID: {item.id}
                        </span>
                      </div>
                      <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
                        <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
                          <Listbox
                            value={booking_status.map(
                              (status) => status.id === item.status_id
                            )}
                            onChange={(e: any) =>
                              handleUpdateBookingStatus(item.id, e.id)
                            }
                          >
                            {({ open }) => (
                              <>
                                <div className="relative mt-2">
                                  <Listbox.Button className="relative w-[180px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center">
                                      {booking_status.map(
                                        (status) =>
                                          status.id === item.status_id &&
                                          status?.icon && (
                                            <div key={status.id}>
                                              {React.createElement(
                                                status.icon,
                                                {
                                                  size: 24,
                                                  className: `text-${status.color}`,
                                                }
                                              )}
                                            </div>
                                          )
                                      )}
                                      <span className="ml-3 block truncate">
                                        {booking_status.map(
                                          (status) =>
                                            status.id === item.status_id &&
                                            status.name
                                        )}
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
                                              active
                                                ? "bg-rose-100"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={person}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <div className="flex items-center">
                                                {person?.icon && (
                                                  <>
                                                    {React.createElement(
                                                      person.icon,
                                                      {
                                                        size: 24,
                                                        className: `text-${person.color}`,
                                                      }
                                                    )}
                                                  </>
                                                )}
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
                          </Listbox>
                          <div className="font-extrabold text-[20px]">
                            Total Price:
                            <span className="pl-2 font-bold text-[18px]">
                              ${item.total_price}
                            </span>
                          </div>
                        </div>
                        <div className="border-b-[#cdcdcd] border-b-[1px] p-4 w-full">
                          <div className="text-[#828080] font-bold text-[14px] mb-2">
                            USER INFORMATION
                          </div>
                          <div className="flex justify-start items-start space-x-6 w-full">
                            <Image
                              src={item.user.avatar || emptyAvatar}
                              width={64}
                              height={64}
                              className="rounded-full aspect-square"
                              alt="Avatar"
                            />
                            <div className="w-[60%]">
                              <div className="flex justify-between items-start w-full space-x-12">
                                <div>
                                  <div className="text-[16px] font-semibold">
                                    Fullname:{" "}
                                    <span className="ml-1 font-normal">
                                      {item.user.full_name ||
                                        item.user.username ||
                                        "-"}
                                    </span>
                                  </div>
                                  <div className="text-[16px] font-semibold">
                                    Email:
                                    <span className="ml-1 font-normal">
                                      {item.user.email || "-"}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  {item?.guest_name && (
                                    <div className="text-[16px] font-semibold">
                                      Guestname:
                                      <span className="ml-1 font-normal">
                                        {item.guest_name || "-"}
                                      </span>
                                    </div>
                                  )}
                                  <div className="text-[16px] font-semibold">
                                    Phone:
                                    <span className="ml-1 font-normal">
                                      {item.user.phone || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {item?.content_to_vendor && (
                                <div className="text-[16px] font-semibold">
                                  Content from{" "}
                                  {item.user.full_name || item.user.username}:
                                  <span className="ml-1 font-normal">
                                    {item.content_to_vendor || "-"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
                          <div className="text-[16px] font-semibold">
                            To: {item.checkin_date}
                          </div>
                          <div className="text-[16px] font-semibold">
                            From: {item.checkout_date}
                          </div>
                        </div>
                        <div className="flex justify-start items-center space-x-32 p-4">
                          <div className="">
                            <div className="text-[#828080] font-bold text-[14px]">
                              PURCHASED ON
                            </div>
                            <div className="text-[16px] font-semibold">
                              {item.created_at
                                .split("T")[0]
                                .split("-")
                                .reverse()
                                .join("-") || "-"}
                            </div>
                          </div>
                          <div className="">
                            <div className="text-[#828080] font-bold text-[14px]">
                              PAYMENT METHOD
                            </div>
                            <div className="text-[16px] font-semibold">COD</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      )}

      {currentStep === steps.AMENITIES && (
        <>
          {!isLoading ? (
            <div className="grid grid-cols-12 gap-x-12 gap-y-3 mb-8 w-full">
              <>
                {amenities &&
                  amenities.map((item: Amenity, index: number) => {
                    const offerItem = offers.find(
                      (offer) => offer.label === item.name
                    );
                    const isChecked = selectedAmenities.some(
                      (selected: Amenity) => selected.description === item.name
                    );

                    return (
                      <div
                        key={index}
                        className="col-span-6 flex justify-between items-center text-center gap-4 my-1 cursor-pointer"
                      >
                        <label
                          htmlFor={`type-${index}`}
                          className="text-lg text-zinc-600 font-thin cursor-pointer flex items-center justify-between space-x-6"
                        >
                          {offerItem && (
                            <>
                              {React.createElement(offerItem.icon, {
                                size: 25,
                                className: "text-gray-700",
                              })}
                            </>
                          )}
                          <p className="text-neutral-500">
                            {item?.name || "-"}
                          </p>
                        </label>
                        <input
                          id={`type-${index}`}
                          name="type"
                          type="checkbox"
                          className="w-6 h-6 rounded-full cursor-pointer"
                          onChange={(e) => handleAmenityCheckboxChange(e, item)}
                          defaultChecked={isChecked}
                        />
                      </div>
                    );
                  })}
              </>
            </div>
          ) : (
            <Loader />
          )}
          <hr />
          <div className="grid grid-cols-12 gap-8 mt-8">
            <div className="col-span-6"></div>
            <div className="col-span-6 flex justify-between items-start space-x-8">
              <div className="w-1/2">
                <Button
                  outline
                  label="Cancel"
                  onClick={() => {
                    reset();
                    setCurrentStep(steps.GENERAL);
                  }}
                />
              </div>
              <div className="w-1/2">
                <Button
                  disabled={isLoading}
                  label="Update"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {currentStep === steps.POLICIES && (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="gap-x-12 mb-8">
                <span className="text-xl font-bold text-[#222]">
                  House rules
                </span>
                <div className="flex justify-between items-center space-x-8">
                  <div className="w-full relative">
                    <input
                      onChange={(e) => setCheckinTime(e.target.value)}
                      type="time"
                      value={checkinTime}
                      id="_location"
                      className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
                    />
                    <label
                      className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                    >
                      Checkin Time
                    </label>
                  </div>
                  <div className="text-neutral-400 text-[64px]">-</div>
                  <div className="w-full relative">
                    <input
                      onChange={(e) => setCheckoutTime(e.target.value)}
                      type="time"
                      value={checkoutTime}
                      id="_location"
                      className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
                    />
                    <label
                      className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                    >
                      Checkout Time
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-12 mb-8">
                <div className="col-span-6">
                  <span className="text-xl font-bold text-[#222] block mb-4">
                    Safe rules
                  </span>
                  <div className="flex justify-between items-center space-x-8">
                    <textarea
                      className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
                      placeholder="Content ..."
                      value={safePolicy}
                      onChange={(e) => setSafePolicy(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="col-span-6">
                  <span className="text-xl font-bold text-[#222] block mb-4">
                    Cancel rules
                  </span>
                  <div className="flex justify-between items-center space-x-8">
                    <textarea
                      className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
                      placeholder="Content ..."
                      value={cancelPolicy}
                      onChange={(e) => setCancelPolicy(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <hr />
              <div className="grid grid-cols-12 gap-8 mt-8">
                <div className="col-span-6"></div>
                <div className="col-span-6 flex justify-between items-start space-x-8">
                  <div className="w-1/2">
                    <Button
                      outline
                      label="Cancel"
                      onClick={() => {
                        setCheckinTime(undefined);
                        setCheckoutTime(undefined);
                        setSafePolicy("");
                        setCancelPolicy("");
                        setCurrentStep(steps.GENERAL);
                      }}
                    />
                  </div>
                  <div className="w-1/2">
                    <Button
                      disabled={isLoading}
                      label="Update"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyClient;
