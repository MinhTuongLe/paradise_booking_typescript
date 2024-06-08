/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval, parse } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Cookie from "js-cookie";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import { FaBusinessTime, FaFlag, FaStar } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { formatISO } from "date-fns";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useReportModal from "@/hook/useReportModal";
import Container from "./Container";
import ListingHead from "./listing/ListingHead";
import ListingInfo from "./listing/ListingInfo";
import ListingReservation from "./listing/ListingReservation";
import ListingComments from "./listing/ListingComments";
import Button from "./Button";
import Input from "./inputs/Input";
import {
  API_URL,
  classNames,
  payment_methods,
  emptyImage,
  emptyAvatar,
} from "@/const";
import { DateRange, Place } from "@/models/place";
import { User } from "@/models/user";
import {
  CreateReservationPlaceDataSubmit,
  CreateReservationUserDataSubmit,
} from "@/models/api";
import { RootState } from "@/store/store";
import { getUserName } from "@/utils/getUserInfo";
import { ConfigType, BookingMode, Role, ReportTypes } from "@/enum";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import Loader from "./Loader";

interface ListingClientProps {
  place: Place;
  currentUser: User | undefined;
}

const ListingClient: React.FC<ListingClientProps> = ({
  place,
  currentUser,
}) => {
  let reservations: any[] = [];
  const { t } = useTranslation("translation", { i18n });
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const location = {
    address: place.address,
    district: place.district,
    state: place.state,
    country: place.country,
  };
  const [lat, setLat] = useState<number>(place?.lat || 51);
  const [lng, setLng] = useState<number>(place?.lng || -0.09);

  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    [lat, lng]
  );
  const router = useRouter();
  const pathname = usePathname();

  const reportModal = useReportModal();

  const disableDates = useMemo(() => {
    let dates: any[] = [];

    reservations &&
      reservations.forEach((reservation) => {
        const startDate = parse(reservation[0], "dd-MM-yyyy", new Date());
        const endDate = parse(reservation[1], "dd-MM-yyyy", new Date());

        const range = eachDayOfInterval({ start: startDate, end: endDate });

        dates = [...dates, ...range];
      });
    return dates;
  }, [reservations]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      guest_name: "",
      content_to_vendor: "",
      number_of_guest: place.max_guest || 0,
    },
    mode: "all",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(place.price_per_night);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [paymentMode, setPaymentMode] = useState<boolean>(false);
  const [dayCount, setDayCount] = useState(1);
  const [bookingMode, setBookingMode] = useState(BookingMode.ForMySelf);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [checkinTime, setCheckinTime] = useState();
  const [checkoutTime, setCheckoutTime] = useState();
  const [safePolicy, setSafePolicy] = useState("");
  const [cancelPolicy, setCancelPolicy] = useState("");
  const [selected, setSelected] = useState(payment_methods[0]);
  const [isAvailable, setIsAvailable] = useState(false);

  const [searchResult, setSearchResult] = useState<any>(null);
  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  const setCustomValue = (id: any, value: string) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onCreateReservation: SubmitHandler<
    CreateReservationUserDataSubmit
  > = async (data: CreateReservationUserDataSubmit) => {
    try {
      setIsLoading(true);
      const checkin_date = formatISO(dateRange[0].startDate)
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
      const checkout_date = formatISO(dateRange[0].endDate)
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");

      let submitValues: CreateReservationPlaceDataSubmit = {
        place_id: place.id,
        checkin_date,
        checkout_date,
        payment_method: selected.id,
        booking_info: {
          ...data,
          type: bookingMode,
          total_price: totalPrice,
          number_of_guest: Number(data.number_of_guest),
        },
      };

      if (authState) {
        submitValues = {
          ...submitValues,
          user_id: loggedUser?.id,
        };
      }

      if (data.number_of_guest && data.number_of_guest > place.max_guest) {
        toast.error(
          t("toast.no-guest-must-be-less-or-equal-to-max-guests-of-this-place")
        );
        return;
      }

      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios
        .post(getApiRoute(RouteKey.Bookings), submitValues, config)
        .then((response) => {
          if (response.data.data?.payment_url) {
            window.open(response.data.data.payment_url);
            router.push("/");
          } else
            router.push(`/reservations/${response.data.data?.BookingData?.id}`);

          reset();
        })
        .catch((err) => {
          toast.error(t("toast.booking-failed"));
        });
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    } finally {
      if (!pathname?.includes(`/listings/}`)) setIsLoading(false);
    }
  };

  const getAmenities = async () => {
    setIsLoading(true);
    await axios
      .get(getApiRoute(RouteKey.AmenitiesObject), {
        params: {
          object_id: place.id,
          object_type: ConfigType.Place,
        },
      })
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
      .get(getApiRoute(RouteKey.Policies), {
        params: {
          object_id: place.id,
          object_type: ConfigType.Place,
        },
      })
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

  const onCheckAvailability = () => {
    setIsLoading(true);
    const checkin_date = formatISO(dateRange[0].startDate)
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
    const checkout_date = formatISO(dateRange[0].endDate)
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");

    const config = {
      params: {
        place_id: place.id,
        date_from: checkin_date,
        date_to: checkout_date,
      },
    };

    axios
      .get(getApiRoute(RouteKey.PlaceCheckDateAvailable), config)
      .then((response) => {
        setIsAvailable(response?.data?.data);
        if (!response?.data?.data)
          toast.error(
            t("toast.this-place-is-not-available-on-the-dates-you-selected")
          );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get = async () => {
    await getAmenities();
    await getPolicies();
  };

  useEffect(() => {
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    if (startDate && endDate) {
      const count = differenceInCalendarDays(endDate, startDate);
      setDayCount(count);

      if (count && place.price_per_night) {
        setTotalPrice(count * place.price_per_night);
      } else {
        setTotalPrice(place.price_per_night);
      }
    }
  }, [dateRange, place.price_per_night]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paymentMode]);

  useEffect(() => {
    get();
  }, []);

  return (
    <Container>
      {!paymentMode ? (
        <div className="w-full mx-auto mt-4">
          <div className="flex flex-col">
            <ListingHead
              title={place.name}
              imageSrc={place.cover || emptyImage}
              locationValue={location}
              id={place.id}
              isFree={place.is_free}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 my-8">
              <ListingInfo
                user={currentUser}
                description={place?.description}
                bedCount={place?.num_bed || 0}
                bedRoom={place?.bed_room || 0}
                guestCount={place?.max_guest || 0}
                amenities={selectedAmenities || []}
              />
              <div className="order-first mb-10 md:order-last md:col-span-3 space-y-6">
                <ListingReservation
                  price={place.price_per_night}
                  totalPrice={totalPrice}
                  onChangeDate={(value: DateRange[]) => setDateRange(value)}
                  dateRange={dateRange}
                  onSubmit={onCheckAvailability}
                  disabled={isLoading}
                  disabledDates={disableDates}
                  isAvailable={isAvailable}
                  changeMode={() => setPaymentMode(true)}
                />
                {loggedUser?.role !== Role.Admin && (
                  <div className="w-full flex justify-center items-start">
                    <div
                      className="flex justify-center items-center gap-4 cursor-pointer"
                      onClick={() =>
                        reportModal.onOpen({ type: ReportTypes.Place })
                      }
                    >
                      <FaFlag size={16} />
                      <span className="underline">
                        {t("components.report-this-room")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <hr />
            <ListingComments
              place_id={place.id}
              rating_average={
                Number(place.rating_average).toFixed(1) as unknown as number
              }
            />
            <hr />
            <div className="my-8 w-full">
              <p className="text-xl font-semibold mb-8">
                {t("components.where-you-ll-be")}
              </p>
              <Map center={[lat, lng]} onSearchResult={handleSearchResult} />
            </div>
            <hr />
            <div className="my-8 w-full">
              <p className="flex gap-1 text-2xl font-semibold mb-4">
                {t("components.things-to-know")}
              </p>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4">
                  <p className="flex gap-1 text-lg font-semibold mb-2">
                    {t("components.house-rules")}
                  </p>
                  <ul className="flex flex-col justify-between items-start text-md font-thin space-y-2">
                    {checkinTime && (
                      <li className="text-md font-thin">
                        {t("components.checkin-after")} {checkinTime}
                      </li>
                    )}
                    {checkoutTime && (
                      <li className="text-md font-thin">
                        {t("components.checkout-before")} {checkoutTime}
                      </li>
                    )}
                    <li className="text-md font-thin">
                      {t("components.maximum")} {place?.max_guest || 0}{" "}
                      <span className="lowercase">{t("general.guests")}</span>
                    </li>
                  </ul>
                </div>
                <div className="col-span-4">
                  <p className="flex gap-1 text-lg font-semibold mb-2">
                    {t("property-feature.safe-rules")}
                  </p>
                  <ul className="flex flex-col justify-between items-start text-md font-thin space-y-2">
                    {safePolicy
                      ? safePolicy.split("\n").map((item, index) => (
                          <li className="text-md font-thin" key={index}>
                            {item}
                          </li>
                        ))
                      : "-"}
                  </ul>
                </div>
                <div className="col-span-4">
                  <p className="flex gap-1 text-lg font-semibold mb-2">
                    {t("property-feature.cancel-rules")}
                  </p>
                  <ul className="flex flex-col justify-between items-start text-md font-thin space-y-2">
                    {cancelPolicy
                      ? cancelPolicy.split("\n").map((item, index) => (
                          <li className="text-md font-thin" key={index}>
                            {item}
                          </li>
                        ))
                      : "-"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[80%] mx-auto mt-12">
          {!isLoading ? (
            <>
              <div className="flex justify-start items-start space-x-6">
                <IoChevronBack
                  size={16}
                  onClick={() => {
                    setPaymentMode(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="cursor-pointer"
                />
                <span className="text-xl font-extrabold">
                  {t("components.finish-your-booking")}
                </span>
              </div>
              <div className="grid grid-cols-12 w-full mt-8 space-x-16">
                <div className="col-span-7">
                  <div className="mb-6">
                    <span className="text-lg font-bold mb-6 block">
                      {t("components.your-booking-info")}
                    </span>
                    <Input
                      id="full_name"
                      label={t("general.fullname")}
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                    />
                    <div className="flex gap-6 my-6">
                      <div className="flex-1">
                        <Input
                          id="phone"
                          label={t("general.phone")}
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          type="tel"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          id="email"
                          label={t("general.email")}
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          type="email"
                        />
                      </div>
                    </div>
                    <Input
                      id="number_of_guest"
                      label={t("general.guests")}
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                      type="number"
                    />
                  </div>
                  <hr />
                  <div className="my-6">
                    <div className="flex gap-6 my-6">
                      <div className="flex-1 flex gap-6 justify-start items-center">
                        <input
                          type="radio"
                          id="forMyself"
                          name="bookingMode"
                          value={bookingMode}
                          onChange={() => setBookingMode(BookingMode.ForMySelf)}
                          defaultChecked={bookingMode === BookingMode.ForMySelf}
                          className="w-[20px] h-[20px]"
                          required
                        />
                        <label htmlFor="forMyself">
                          {t("components.booking-for-myself")}
                        </label>
                      </div>
                      <div className="flex-1 flex gap-6 justify-start items-center">
                        <input
                          type="radio"
                          id="forOther"
                          name="bookingMode"
                          value={bookingMode}
                          onChange={() => setBookingMode(BookingMode.ForOther)}
                          defaultChecked={bookingMode === BookingMode.ForOther}
                          className="w-[20px] h-[20px]"
                          required
                        />
                        <label htmlFor="forOther">
                          {t("components.booking-for-other")}
                        </label>
                      </div>
                    </div>
                    {bookingMode === BookingMode.ForOther && (
                      <Input
                        id="guest_name"
                        label={t("components.guest-name")}
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                      />
                    )}
                  </div>
                  <hr />
                  <div className="my-6 flex justify-between items-start">
                    <span className="text-lg font-bold mb-6 block w-[50%]">
                      {t("components.payment-information")}
                    </span>
                    <div className="w-[50%] flex justify-end items-start">
                      <div className="flex justify-between items-center border-b-[#cdcdcd]">
                        <Listbox value={selected} onChange={setSelected}>
                          {({ open }) => (
                            <>
                              <div className="relative">
                                <Listbox.Button className="relative w-[180px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                                  <span className="flex items-center">
                                    <span className="block truncate">
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
                                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm review-horizontal">
                                    {payment_methods.map((person) => (
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
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="my-6">
                    <div className="flex flex-col justify-between items-start mt-4">
                      <span className="text-md font-bold">
                        {t("components.date")}
                      </span>
                      <span className="text-md font-thin">
                        {dayCount > 1
                          ? `${formatISO(dateRange[0].startDate)
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("-")} - ${formatISO(dateRange[0].endDate)
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}`
                          : `${formatISO(dateRange[0].startDate)
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}`}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between items-start">
                      <span className="text-md font-bold">
                        {t("components.place-max-guests")}
                      </span>
                      <span className="text-md font-thin">
                        {place.max_guest || 0} {t("components.guests")}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="my-6">
                    <span className="text-lg font-bold block">
                      {t("components.contact-to-vendor")}
                    </span>
                    <div className="flex justify-start items-center space-x-6 my-4">
                      <Image
                        width={40}
                        height={40}
                        src={currentUser?.avatar || emptyAvatar}
                        alt="Avatar"
                        className="rounded-full h-[40px] w-[40px]"
                        priority
                      />
                      <div>
                        <h1 className="text-md font-bold space-y-3">
                          {currentUser ? getUserName(currentUser) : "User"}
                        </h1>
                        <p>
                          {currentUser?.created
                            .split(" ")[0]
                            .split("-")
                            .reverse()
                            .join("/") || "-"}
                        </p>
                      </div>
                    </div>
                    <textarea
                      className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none"
                      rows={5}
                      name="content_to_vendor"
                      onChange={(e) =>
                        setCustomValue("content_to_vendor", e.target.value)
                      }
                    ></textarea>
                  </div>
                  <hr />
                  <div className="my-6">
                    <span className="text-lg font-bold">
                      {t("components.general-rule")}
                    </span>
                    <ul className="flex flex-col justify-between items-start mt-4 text-md font-thin">
                      {t("components.we-ask-all-guests-to-remember")}
                      <li className="text-md font-thin">
                        - {t("components.comply-with-house-rules")}
                      </li>
                      <li className="text-md font-thin">
                        - {t("components.maintain-the-house")}
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <div className="w-full flex justify-between items-start space-x-4 my-6">
                    <FaBusinessTime size={64} />
                    <span className="text-lg font-semibold">
                      {t("components.your-reservation-will-not-be-confirmed")}
                      <span className="font-thin ml-2">
                        {t("components.you-will-not-be-charged-until-then")}
                      </span>
                    </span>
                  </div>
                  <hr />
                  <div className="w-1/3 mt-6">
                    <Button
                      disabled={isLoading}
                      label={t("components.reservation")}
                      onClick={handleSubmit(onCreateReservation)}
                    />
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="p-4 space-y-4 border-[1px] rounded-xl">
                    <div className="w-full flex justify-between items-center space-x-4">
                      <div className="w-[30%]">
                        <Image
                          width={500}
                          height={500}
                          src={place?.cover || emptyImage}
                          alt="room image"
                          className="rounded-xl aspect-square"
                          priority
                        />
                      </div>
                      <div className="w-[70%]">
                        <div className="space-y-1">
                          <p className="text-sm font-thin">
                            {t("components.room")}
                          </p>
                          <p className="text-md font-bold">
                            {place?.name || "Room Name"}
                          </p>
                        </div>
                        <div className="flex items-center justify-start space-x-2">
                          <FaStar size={8} />
                          <span className="text-sm font-bold">5.0</span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <span className="text-lg font-bold">
                        {t("components.price-details")}
                      </span>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-md font-thin">
                          {getPriceFormated(
                            place?.price_per_night ? place?.price_per_night : 0
                          )}{" "}
                          VND x {dayCount ? dayCount : 1}
                        </span>
                        <span className="text-md font-thin">
                          {getPriceFormated(totalPrice)} VND
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-md font-thin">
                          {t("components.service-fee")}
                        </span>
                        <span className="text-md font-thin">
                          {getPriceFormated(0)} VND
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-md font-bold">
                        {t("components.total")} (VND):
                      </span>
                      <span className="text-md font-bold">
                        {getPriceFormated(totalPrice)} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </Container>
  );
};

export default ListingClient;
