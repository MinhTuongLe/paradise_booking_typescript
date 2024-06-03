/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval, parse } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Cookie from "js-cookie";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import { FaBell, FaBusinessTime, FaCopy, FaFlag, FaStar } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { formatISO } from "date-fns";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { DateRangePicker } from "react-date-range";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import qs from "query-string";

import i18n from "@/i18n/i18n";
import useReportModal from "@/hook/useReportModal";
import Container from "./Container";
import Button from "./Button";
import Input from "./inputs/Input";
import {
  classNames,
  payment_methods,
  emptyImage,
  emptyAvatar,
  formatDateType,
  formatDateTimeType,
  maxPrice,
} from "@/const";
import { DateRange, Rating } from "@/models/place";
import { User } from "@/models/user";
import { CreateGuiderReservationDataSubmit } from "@/models/api";
import GuiderHead from "./post-guiders/GuiderHead";
import GuiderInfo from "./post-guiders/GuiderInfo";
import GuiderReservation from "./post-guiders/GuiderReservation";
import GuiderComments from "./post-guiders/GuiderComments";
import { BookingRatingType, ConfigType } from "@/enum";
import { CalendarPostGuider, PostGuider } from "@/models/post";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { getOwnerName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import RangeSlider from "./RangeSlider";

interface PostGuiderClientProps {
  data: PostGuider;
  calendar: CalendarPostGuider[];
  owner_full_data: User;
}

const PostGuiderClient: React.FC<PostGuiderClientProps> = ({
  data,
  calendar,
  owner_full_data,
}) => {
  let reservations: any[] = [];
  const pathName = usePathname();
  const params = useSearchParams();

  const { t } = useTranslation("translation", { i18n });

  const currentUrl = window.location.href;

  const [lat, setLat] = useState<number>(51);
  const [lng, setLng] = useState<number>(-0.09);

  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    [lat, lng]
  );
  const router = useRouter();
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
      name: "",
      phone: "",
      email: "",
      note: "",
      number_of_people: 1,
      payment_method: payment_methods[0].id,
      calendar_guider_id: calendar ? calendar[0].id : 0,
      total_price: 0,
      post_guide_id: data.id,
      guider_id: data.post_owner_id,
    },
    mode: "all",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [paymentMode, setPaymentMode] = useState<boolean>(false);
  const [showAllDatesMode, setShowAllDatesMode] = useState<boolean>(false);
  const [dayCount, setDayCount] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selected, setSelected] = useState(payment_methods[0]);
  const [selectedCalendar, setSelectedCalendar] =
    useState<CalendarPostGuider | null>(null);
  const [price_from, setPriceFrom] = useState(0);
  const [price_to, setPriceTo] = useState(maxPrice);

  const [searchResult, setSearchResult] = useState<any>(null);
  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };
  const [guestRequirements, setGuestRequirements] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [itemsShouldBeCarried, setItemsShouldBeCarried] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);

  const setCustomValue = (id: any, value: string | number) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onCreateReservation: SubmitHandler<
    CreateGuiderReservationDataSubmit
  > = async (data: CreateGuiderReservationDataSubmit) => {
    const accessToken = Cookie.get("accessToken");
    const userId = Cookie.get("userId");

    if (!selectedCalendar) {
      toast.error(t("toast.no-calendar-is-selected"));
      return;
    }

    try {
      setIsLoading(true);

      let submitValues: CreateGuiderReservationDataSubmit = {
        ...data,
        calendar_guider_id: selectedCalendar.id,
        number_of_people: Number(data.number_of_people),
        total_price: selectedCalendar.price || 0,
        payment_method: selected.id,
        user_id: userId ? Number(userId) : null,
      };

      if (
        data.number_of_people &&
        data.number_of_people > selectedCalendar.max_guest
      ) {
        toast.error(
          t(
            "toast.no-guest-must-be-less-or-equal-to-max-guests-of-this-calendar"
          )
        );
        return;
      }

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios
        .post(getApiRoute(RouteKey.BookingGuider), submitValues, config)
        .then((response) => {
          if (response.data.data?.payment_url) {
            window.open(response.data.data.payment_url);
            router.push("/");
          } else
            router.push(
              `/booked-guiders/${response.data.data?.booking_guider_data?.id}`
            );
          reset();
        })
        .catch((err) => {
          toast.error("toast.booking-failed");
        });
    } catch (error) {
      console.log(error);
    } finally {
      if (!pathName?.includes(`/post-guiders/}`)) setIsLoading(false);
    }
  };

  const getAmenities = async () => {
    setIsLoading(true);
    await axios
      .get(getApiRoute(RouteKey.AmenitiesObject), {
        params: {
          object_id: data.id,
          object_type: ConfigType.PostGuide,
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
          object_id: data?.id,
          object_type: ConfigType.PostGuide,
        },
      })
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          if (response.data.data[0]?.name) {
            setGuestRequirements(response.data.data[0]?.name);
          }
          if (response.data.data[1]?.name)
            setCancellationPolicy(response.data.data[1]?.name);
          if (response.data.data[2]?.name)
            setItemsShouldBeCarried(response.data.data[2]?.name);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangePaymentMode = (calendarData: CalendarPostGuider) => {
    setPaymentMode(true);
    setSelectedCalendar(calendarData);
  };

  const getRatings = async () => {
    setIsLoading(true);
    await axios
      .get(getApiRoute(RouteKey.BookingRatingsByVendorId), {
        params: {
          vendor_id: data.post_owner_id,
          object_type: BookingRatingType.BookingRatingTypeGuide,
        },
      })
      .then((response) => {
        setRatings(response.data.data.ListRating);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  const get = async () => {
    await getAmenities();
    await getPolicies();
    await getRatings();
  };

  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowPriceRange, setIsShowPriceRange] = useState(false);

  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);

  const priceRangeFilterSection = useRef<HTMLDivElement>(null);
  const priceRangePickerSection = useRef<HTMLDivElement>(null);

  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Copy successfully");
  };

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

  const scrollToPriceRangeFilterSection = () => {
    if (priceRangeFilterSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        priceRangeFilterSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowPriceRange((prev) => !prev);
    }
  };

  const onSubmitUpdateQuery = useCallback(async () => {
    let currentQuery = {};
    let updatedQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      date_from: dateRange[0]?.startDate
        ? dayjs(formatISO(dateRange[0].startDate)).format(
            formatDateTimeType.YMD_HMS
          )
        : "",
      date_to: dateRange[0]?.endDate
        ? dayjs(formatISO(dateRange[0].endDate)).format(
            formatDateTimeType.YMD_HMS
          )
        : "",
      price_from: price_from,
      price_to: price_to,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName || `/post-guiders/${data.id}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, dateRange, price_from, price_to, params, data.id, pathName]);

  const handleClearAllFilters = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setPriceFrom(0);
    setPriceTo(maxPrice);
    const url = qs.stringifyUrl({
      url: pathName || `/post-guiders/${data.id}`,
      query: {},
    });

    router.push(url);
  };

  const onSubmitCallback = (minValue: number, maxValue: number) => {
    setPriceFrom(minValue);
    setPriceTo(maxValue);
  };

  useEffect(() => {
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    if (startDate && endDate) {
      const count = differenceInCalendarDays(endDate, startDate);
      setDayCount(count);
    }
  }, [dateRange]);

  useEffect(() => {
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    if (startDate && endDate) {
      const count = differenceInCalendarDays(endDate, startDate);
      setDayCount(count);
    }
  }, [dateRange]);

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
        priceRangeFilterSection.current &&
        !priceRangeFilterSection.current.contains(event.target as Node) &&
        priceRangePickerSection.current &&
        !priceRangePickerSection.current.contains(event.target as Node)
      ) {
        setIsShowPriceRange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [priceRangeFilterSection, priceRangePickerSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareOptionsSection.current &&
        !shareOptionsSection.current.contains(event.target as Node) &&
        shareOptionsPickerSection.current &&
        !shareOptionsPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowDateRange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareOptionsSection, shareOptionsPickerSection]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    if (showAllDatesMode) {
      setDateRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      setDayCount(1);
    }
  }, [showAllDatesMode]);

  useEffect(() => {
    get();
  }, []);

  return (
    <Container>
      {!showAllDatesMode ? (
        <>
          {!paymentMode ? (
            <div className="w-full mx-auto mt-4">
              <div className="flex flex-col">
                <div
                  className="underline text-md mt-4 mb-6 cursor-pointer hover:text-rose-500"
                  onClick={() => window.open(`/post-guiders`, "_blank")}
                >
                  {t("post-guider-feature.all-experiences")}
                </div>
                <GuiderHead
                  title={data.title || "-"}
                  imageSrc={data.cover || emptyImage}
                  locationValue={data.location}
                  id={1}
                  isFree={true}
                  topicId={data.topic_id}
                  locationAddress={data.address}
                />
                <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10 my-12">
                  <GuiderInfo
                    postOwner={data.post_owner}
                    postOwnerId={data.post_owner_id}
                    description={data.description}
                    amenities={selectedAmenities || []}
                    owner_full_data={owner_full_data}
                    languages={data.languages}
                    schedule={data.schedule}
                    ratings={ratings || []}
                  />
                  <div className="order-first mb-10 md:order-last md:col-span-5 space-y-6">
                    {calendar && calendar.length > 0 ? (
                      <GuiderReservation
                        calendarData={calendar}
                        onSubmit={handleSubmit(onCreateReservation)}
                        disabled={isLoading}
                        changeMode={(calendarData: CalendarPostGuider) =>
                          handleChangePaymentMode(calendarData)
                        }
                        showAllDates={() => setShowAllDatesMode(true)}
                        postguiderId={data.id}
                      />
                    ) : (
                      <div className="text-rose-500 text-2xl font-bold text-center w-full">
                        {t("post-guider-feature.no-calendar-to-booking")}
                      </div>
                    )}
                    <div className="w-full flex justify-center items-start">
                      <div
                        className="flex justify-center items-center gap-4 cursor-pointer"
                        // onClick={() =>
                        //   reportModal.onOpen({ place, user: currentUser })
                        // }
                      >
                        <FaFlag size={16} />
                        <span className="underline">
                          {t("post-guider-feature.report-this-guider")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <GuiderComments
                  post_id={data.id}
                  rating_average={
                    Number(data?.rating_average || 0).toFixed(
                      1
                    ) as unknown as number
                  }
                />
                <hr />
                <div className="my-8 w-full">
                  <p className="text-xl font-semibold mb-8">{`Where you’ll be`}</p>
                  <Map
                    center={[lat, lng]}
                    onSearchResult={handleSearchResult}
                  />
                </div>
                <hr />
                <div className="my-8 w-full">
                  <p className="flex gap-1 text-2xl font-semibold mb-4">
                    {t("post-guider-feature.things-to-know")}
                  </p>
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4">
                      <p className="flex gap-1 text-lg font-semibold mb-3">
                        {t("post-guider-feature.guest-requirements")}
                      </p>
                      <p className="text-md font-thin whitespace-pre-line leading-4">
                        {guestRequirements || "-"}
                      </p>
                    </div>
                    <div className="col-span-4">
                      <p className="flex gap-1 text-lg font-semibold mb-3">
                        {t("post-guider-feature.cancellation-policy")}
                      </p>
                      <p className="text-md font-thin whitespace-pre-line leading-4">
                        {cancellationPolicy || "-"}
                      </p>
                    </div>
                    <div className="col-span-4">
                      <p className="flex gap-1 text-lg font-semibold mb-3">
                        {t("post-guider-feature.items-should-be-carried")}
                      </p>
                      <p className="text-md font-thin whitespace-pre-line leading-4">
                        {itemsShouldBeCarried || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[80%] mx-auto mt-12">
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
                  {t("post-guider-feature.confirm-and-pay")}
                </span>
              </div>
              <div className="grid grid-cols-12 w-full mt-8 space-x-16">
                <div className="col-span-7">
                  <div className="space-x-4 px-4 py-3 mb-6 w-full flex justify-start items-center border-solid border-[1px] rounded-xl border-neutral-500">
                    <div className="p-3 bg-rose-500 rounded-[50%]">
                      <FaBell size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 font-semibold">
                        {t("post-guider-feature.this-experience-is-held-in")}{" "}
                        {data.languages &&
                          data.languages.length > 0 &&
                          data.languages.map(
                            (language: string, index: number) => (
                              <span key={index}>
                                {language || "Tiếng Việt"}{" "}
                                {index < data.languages.length - 1 && ", "}
                              </span>
                            )
                          )}
                      </span>
                      <span className="text-neutral-400 font-thin">
                        {t("post-guider-feature.make-sure-right-language")}
                      </span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="text-lg font-bold mb-6 block">
                      {t("components.your-booking-info")}
                    </span>
                    <Input
                      id="name"
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
                          label="E-mail"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          type="email"
                        />
                      </div>
                    </div>
                    <Input
                      id="number_of_people"
                      label={t("post-guider-feature.no-people")}
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                      type="number"
                      mustBeInteger={true}
                    />
                  </div>
                  <hr />
                  <div className="my-6 flex justify-between items-start">
                    <span className="text-lg font-bold block w-[50%]">
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
                    <span className="text-lg font-bold block">
                      {t("post-guider-feature.contact-to-guider")}
                    </span>
                    <div className="flex justify-start items-center space-x-6 my-4">
                      <Image
                        width={40}
                        height={40}
                        src={data.post_owner.avatar || emptyAvatar}
                        alt="Avatar"
                        className="rounded-full h-[40px] w-[40px]"
                        priority
                      />
                      <div>
                        <h1 className="text-md font-bold space-y-3">
                          {data.post_owner
                            ? getOwnerName(data.post_owner)
                            : "Guider"}
                        </h1>
                        <p>
                          {dayjs(owner_full_data.created).format(
                            formatDateType.DMY
                          )}
                        </p>
                      </div>
                    </div>
                    <textarea
                      className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none"
                      rows={5}
                      name="note"
                      onChange={(e) => setCustomValue("note", e.target.value)}
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
                        {t("components.comply-with-house-rules")}
                      </li>
                      <li className="text-md font-thin">
                        {t("components.maintain-the-house")}
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
                          src={data?.cover || emptyImage}
                          alt="room image"
                          className="rounded-xl aspect-square"
                          priority
                        />
                      </div>
                      <div className="w-[70%]">
                        <div className="space-y-1">
                          <p className="text-sm font-thin">{data?.title}</p>
                          <p className="text-md font-bold">
                            {data?.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-start space-x-2">
                          <FaStar size={8} />
                          <span className="text-sm font-bold">
                            {data?.rating_average || 0}
                          </span>
                          <span className="text-sm font-thin">
                            ({ratings.length || 0} {t("components.comments")})
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <span className="text-lg font-bold">
                        {t("post-guider-feature.reservation-details")}
                      </span>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-md font-thin">
                            {selectedCalendar?.date_from.split(" ")[0]} -{" "}
                            {selectedCalendar?.date_to.split(" ")[0]}
                          </span>
                          <span className="text-md font-thin">
                            {selectedCalendar?.date_from.split(" ")[1]} -{" "}
                            {selectedCalendar?.date_to.split(" ")[1]}
                          </span>
                        </div>
                        <span className="text-md font-thin">
                          {t("post-guider-feature.for")}{" "}
                          {selectedCalendar?.max_guest || 0}{" "}
                          {t("post-guider-feature.people")}
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-md font-bold">
                        {t("components.total")} (VND):
                      </span>
                      <span className="text-md font-bold">
                        {getPriceFormated(selectedCalendar?.price || 0)} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex relative mt-10 w-[80%] mx-auto justify-between h-[80vh] overflow-hidden">
          <div className="fixed bg-white w-[30vw] z-10">
            <div
              className="cursor-pointer absolute top-0 -left-20"
              onClick={() => setShowAllDatesMode(false)}
            >
              <IoIosCloseCircleOutline
                size={36}
                className="hover:text-rose-500"
              />
            </div>
            <div className="mx-auto grid grid-cols-2 divide-x border-solid border-[1px] border-neutral-500 rounded-xl mt-6 mb-10">
              <div className="flex justify-between items-center relative">
                <div
                  className={`px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tl-xl rounded-bl-xl h-full ${
                    !isShowDateRange ? "bg-white" : "bg-rose-500"
                  }`}
                  onClick={scrollToRateRangeFilterSection}
                  ref={dateRangeFilterSection}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold ${
                        !isShowDateRange ? "text-neutral-500" : "text-white"
                      }`}
                    >
                      {t("components.date")}
                    </span>
                    <span
                      className={`text-md font-thin ${
                        !isShowDateRange ? "text-neutral-400" : "text-white"
                      }`}
                    >
                      {dayCount > 0
                        ? dayCount + ` (${t("general.days")})`
                        : t("general.any-week")}
                    </span>
                  </div>
                  {!isShowDateRange ? (
                    <FaAngleDown size={24} />
                  ) : (
                    <FaAngleUp size={24} className="text-white" />
                  )}
                </div>
                <div
                  ref={dateRangePickerSection}
                  className={`${
                    !isShowDateRange
                      ? "hidden"
                      : "absolute top-[110%] left-0 z-10 w-[50vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
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
              <div className="flex justify-between items-center relative">
                <div
                  className={`px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tr-xl rounded-br-xl ${
                    !isShowPriceRange ? "bg-white" : "bg-rose-500"
                  }`}
                  onClick={scrollToPriceRangeFilterSection}
                  ref={priceRangeFilterSection}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold ${
                        !isShowPriceRange ? "text-neutral-500" : "text-white"
                      }`}
                    >
                      {t("general.price-range")}
                    </span>
                    <span
                      className={`text-md font-thin ${
                        !isShowPriceRange ? "text-neutral-400" : "text-white"
                      }`}
                    >
                      {`${getPriceFormated(
                        Number(price_from)
                      )} VND - ${getPriceFormated(Number(price_to))} VND`}{" "}
                    </span>
                  </div>
                  {!isShowPriceRange ? (
                    <FaAngleDown size={24} />
                  ) : (
                    <FaAngleUp size={24} className="text-white" />
                  )}
                </div>
                <div
                  ref={priceRangePickerSection}
                  className={`${
                    !isShowPriceRange
                      ? "hidden"
                      : "space-y-6 p-6 absolute top-[110%] left-0 z-10 w-[25vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden bg-white"
                  }`}
                >
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
              </div>
            </div>
            <div className="flex space-x-6 mb-10">
              <Button
                label={t("general.filter")}
                onClick={onSubmitUpdateQuery}
              />
              <Button
                outline
                label={t("general.clear-all")}
                onClick={handleClearAllFilters}
              />
            </div>
            <hr />

            <div className="flex justify-start items-start space-x-2 mt-8">
              <div className="w-[90%] flex flex-col space-y-1">
                <span className="text-lg font-bold">
                  {t(
                    "post-guider-feature.display-a-list-of-the-entire-schedule"
                  )}
                </span>
                <span className="text-neutral-500 font-thin text-md">
                  {t(
                    "post-guider-feature.schedules-are-not-organized-with-individual-groups"
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white w-[35vw] absolute right-0 top-6 max-h-[80vh] overflow-y-auto pr-2 vendor-room-listing">
            {calendar &&
              calendar.length > 0 &&
              calendar.map((element, index) => (
                <div
                  key={element.id}
                  className="flex flex-col mb-8 border-solid border-[1px] rounded-xl border-neutral-500"
                >
                  <div className="flex justify-between items-start my-8 space-x-12 px-6">
                    <div className="flex flex-col">
                      <span className="text-neutral-500 font-semibold">
                        {element.date_from.split(" ")[0]} -{" "}
                        {element.date_to.split(" ")[0]}
                      </span>
                      <span className="text-neutral-400 font-thin text-sm">
                        {element.date_from.split(" ")[1]} -{" "}
                        {element.date_to.split(" ")[1]}
                      </span>
                      <div className="pt-4 flex flex-col space-y-1">
                        <span className="font-thin">
                          {t("post-guider-feature.for-up-to")}{" "}
                          {element.max_guest} {t("components.guests")}
                        </span>
                        <span className="font-thin text-ellipsis line-clamp-1">
                          {element.note}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-8">
                      <span className="text-md text-neutral-400 font-thin">
                        <span className="font-semibold">
                          {t("general.from")}{" "}
                          {getPriceFormated(element?.price || 0)} VND
                        </span>{" "}
                        / {t("post-guider-feature.person")}
                      </span>
                      <Button
                        disabled={element.max_guest <= 0}
                        label={t("post-guider-feature.choose")}
                        onClick={() => {
                          setPaymentMode(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default PostGuiderClient;
