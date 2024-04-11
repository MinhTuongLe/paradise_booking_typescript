/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval, parse } from "date-fns";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Cookie from "js-cookie";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import Image from "next/image";
import { FaBell, FaBusinessTime, FaCopy, FaFlag, FaStar } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { formatISO, addDays } from "date-fns";
import { SlCompass } from "react-icons/sl";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { DateRangePicker } from "react-date-range";
import { AiOutlineShareAlt } from "react-icons/ai";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  TelegramIcon,
} from "react-share";

import useReportModal from "@/hook/useReportModal";
import Container from "./Container";
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
import GuiderHead from "./post-guiders/GuiderHead";
import GuiderInfo from "./post-guiders/GuiderInfo";
import GuiderReservation from "./post-guiders/GuiderReservation";
import GuiderComments from "./post-guiders/GuiderComments";
import Heading from "./Heading";
import Counter from "./inputs/Counter";
import { BookingMode } from "@/enum";

interface PostGuiderClientProps {
  place: Place;
  currentUser: User | undefined;
}

const PostGuiderClient: React.FC<any> = () => {
  let reservations: any[] = [];
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const currentUrl = window.location.href;

  // const location = {
  //   address: place.address,
  //   district: place.district,
  //   state: place.state,
  //   country: place.country,
  // };
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
      full_name: "",
      phone: "",
      email: "",
      guest_name: "",
      content_to_vendor: "",
      number_of_guest: 0,
      max_guest: 1,
      num_bed: 1,
      bed_room: 1,
    },
  });

  const num_bed = watch("num_bed");
  const bed_room = watch("bed_room");
  const max_guest = watch("max_guest");

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(9999);
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
  const [bookingMode, setBookingMode] = useState(BookingMode.ForMySelf);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [checkinTime, setCheckinTime] = useState();
  const [checkoutTime, setCheckoutTime] = useState();
  const [safePolicy, setSafePolicy] = useState("");
  const [cancelPolicy, setCancelPolicy] = useState("");
  const [selected, setSelected] = useState(payment_methods[0]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [bookingGuestMode, setBookingGuestMode] = useState("vi");

  const [searchResult, setSearchResult] = useState<any>(null);
  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  const setCustomValue = (id: any, value: string | number) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onCreateReservation: SubmitHandler<
    CreateReservationUserDataSubmit
  > = async (data: CreateReservationUserDataSubmit) => {
    // try {
    //   setIsLoading(true);
    //   const checkin_date = formatISO(dateRange[0].startDate)
    //     .split("T")[0]
    //     .split("-")
    //     .reverse()
    //     .join("-");
    //   const checkout_date = formatISO(dateRange[0].endDate)
    //     .split("T")[0]
    //     .split("-")
    //     .reverse()
    //     .join("-");
    //   let submitValues: CreateReservationPlaceDataSubmit = {
    //     place_id: place.id,
    //     checkin_date,
    //     checkout_date,
    //     payment_method: selected.id,
    //     booking_info: {
    //       ...data,
    //       type: bookingMode,
    //       total_price: totalPrice,
    //       number_of_guest: Number(data.number_of_guest),
    //     },
    //   };
    //   if (authState) {
    //     submitValues = {
    //       ...submitValues,
    //       user_id: loggedUser?.id,
    //     };
    //   }
    //   if (data.number_of_guest && data.number_of_guest > place.max_guest) {
    //     toast.error(
    //       "No guest must be less or equal to max guest(s) of this place"
    //     );
    //     return;
    //   }
    //   const accessToken = Cookie.get("accessToken");
    //   const config = {
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   };
    //   // console.log(submitValues);
    //   await axios
    //     .post(`${API_URL}/bookings`, submitValues, config)
    //     .then((response) => {
    //       if (response.data.data?.payment_url) {
    //         window.open(response.data.data.payment_url);
    //         router.push("/");
    //       } else
    //         router.push(`/reservations/${response.data.data?.BookingData?.id}`);
    //       setIsLoading(false);
    //       router.refresh();
    //       reset();
    //     })
    //     .catch((err) => {
    //       toast.error("Booking Failed");
    //       setIsLoading(false);
    //     });
    // } catch (error) {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const getAmenities = async () => {
    // setIsLoading(true);
    // await axios
    //   .get(`${API_URL}/amenities/place/${place.id}`)
    //   .then((response) => {
    //     setSelectedAmenities(response.data.data);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //   });
  };

  const getPolicies = async () => {
    // setIsLoading(true);
    // await axios
    //   .get(`${API_URL}/policies/${place.id}`)
    //   .then((response) => {
    //     if (response.data.data && response.data.data.length > 0) {
    //       if (response.data.data[0]?.name) {
    //         const houseRules = response.data.data[0]?.name;
    //         const regex = /(\d{1,2}:\d{2})/g;
    //         const matches = houseRules.match(regex);
    //         const checkinTime = matches[0];
    //         const checkoutTime = matches[1];
    //         setCheckinTime(checkinTime);
    //         setCheckoutTime(checkoutTime);
    //       }
    //       if (response.data.data[1]?.name)
    //         setSafePolicy(response.data.data[1]?.name);
    //       if (response.data.data[2]?.name)
    //         setCancelPolicy(response.data.data[2]?.name);
    //     }
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //   });
  };

  const onCheckAvailability = () => {
    // setIsLoading(true);
    // const checkin_date = formatISO(dateRange[0].startDate)
    //   .split("T")[0]
    //   .split("-")
    //   .reverse()
    //   .join("-");
    // const checkout_date = formatISO(dateRange[0].endDate)
    //   .split("T")[0]
    //   .split("-")
    //   .reverse()
    //   .join("-");
    // const config = {
    //   params: {
    //     place_id: place.id,
    //     date_from: checkin_date,
    //     date_to: checkout_date,
    //   },
    // };
    // axios
    //   .get(`${API_URL}/places/check_date_available`, config)
    //   .then((response) => {
    //     setIsAvailable(response?.data?.data);
    //     if (!response?.data?.data)
    //       toast.error("This place is not available on the dates you selected");
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //   });
  };

  // const get = async () => {
  //   await getAmenities();
  //   await getPolicies();
  // };

  // useEffect(() => {
  //   const startDate = dateRange[0].startDate;
  //   const endDate = dateRange[0].endDate;

  //   if (startDate && endDate) {
  //     const count = differenceInCalendarDays(endDate, startDate);
  //     setDayCount(count);

  //     if (count && place.price_per_night) {
  //       setTotalPrice(count * place.price_per_night);
  //     } else {
  //       setTotalPrice(place.price_per_night);
  //     }
  //   }
  // }, [dateRange, place.price_per_night]);

  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowMaxGuest, setIsShowMaxGuest] = useState(false);

  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);

  const maxGuestFilterSection = useRef<HTMLDivElement>(null);
  const maxGuestPickerSection = useRef<HTMLDivElement>(null);

  const [isShowShareOptions, setIsShowShareOptions] = useState(false);
  const shareOptionsSection = useRef<HTMLDivElement>(null);
  const shareOptionsPickerSection = useRef<HTMLDivElement>(null);

  const scrollToShareOptionsSection = () => {
    if (shareOptionsSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        shareOptionsSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowShareOptions((prev) => !prev);
    }
  };

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
        maxGuestFilterSection.current &&
        !maxGuestFilterSection.current.contains(event.target as Node) &&
        maxGuestPickerSection.current &&
        !maxGuestPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowMaxGuest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [maxGuestFilterSection, maxGuestPickerSection]);

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

  // useEffect(() => {
  //   get();
  // }, []);

  const handleChangeBookingMode = () => {
    if (bookingGuestMode === "en") setBookingGuestMode("vi");
    else setBookingGuestMode("en");
  };

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
                  All online experiences
                </div>
                <GuiderHead
                  title={"Create a custom tutorial of Tokyo with local guides"}
                  imageSrc={
                    "https://www.usnews.com/object/image/00000162-f3bb-d0d5-a57f-fbfb3eef0000/32-lake-louise.jpg?update-time=1677094961403&size=responsive640" ||
                    emptyImage
                  }
                  locationValue={location}
                  id={1}
                  isFree={true}
                />
                <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 my-12">
                  <GuiderInfo
                    user={undefined}
                    description={"Online itinerary planning hosted by Sumire"}
                    bedCount={0}
                    bedRoom={0}
                    guestCount={0}
                    amenities={selectedAmenities || []}
                  />
                  <div className="order-first mb-10 md:order-last md:col-span-2 space-y-6">
                    <GuiderReservation
                      price={0}
                      dateRange={dateRange}
                      onChangeDate={(value: DateRange[]) => setDateRange(value)}
                      onSubmit={onCheckAvailability}
                      disabled={isLoading}
                      disabledDates={disableDates}
                      isAvailable={isAvailable}
                      changeMode={() => setPaymentMode(true)}
                      showAllDates={() => setShowAllDatesMode(true)}
                    />
                    <div className="w-full flex justify-center items-start">
                      <div
                        className="flex justify-center items-center gap-4 cursor-pointer"
                        // onClick={() =>
                        //   reportModal.onOpen({ place, user: currentUser })
                        // }
                      >
                        <FaFlag size={16} />
                        <span className="underline">Report this Guider</span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="my-12 w-full">
                  <h1 className="text-xl font-bold space-y-1">
                    Online itinerary planning
                  </h1>
                  <div className="grid grid-cols-12 gap-8 mt-6">
                    <div className="col-span-4 flex space-x-4 max-w-[80%]">
                      <IoChatbubblesOutline
                        size={52}
                        className="text-rose-500"
                      />
                      <p className="line-clamp-2">
                        Chat with a local Host and get a customized itiner ary
                        for your trip
                      </p>
                    </div>
                    <div className="col-span-4 flex space-x-4 max-w-[80%]">
                      <SlCompass size={52} className="text-rose-500" />
                      <p className="line-clamp-2">
                        Discover hidden local treasures and festivals with
                        exclusive tips from your Host
                      </p>
                    </div>
                    <div className="col-span-4 flex space-x-4 max-w-[80%]">
                      <HiOutlineLocationMarker
                        size={52}
                        className="text-rose-500"
                      />
                      <p className="line-clamp-2">
                        Get your own exclusive travel guidebook prepared by your
                        Host
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <GuiderComments
                  place_id={1}
                  rating_average={Number(4).toFixed(1) as unknown as number}
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
                    Things to know
                  </p>
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6">
                      <p className="flex gap-1 text-lg font-semibold mb-2">
                        Rules to guests
                      </p>
                      <ul className="flex flex-col justify-between items-start text-md font-thin space-y-2">
                        <li className="text-md font-thin">
                          Guests aged 18 and over can participate, a total of 6
                          guests. Parents can also carry children under 2 years
                          old.
                        </li>
                        <li className="text-md font-thin">
                          You will need to live live sound and video to
                          participate.
                        </li>
                        <li className="text-md font-thin">Maximum {0} guest</li>
                      </ul>
                    </div>
                    <div className="col-span-6">
                      <p className="flex gap-1 text-lg font-semibold mb-2">
                        Cancel rules
                      </p>
                      <ul className="flex flex-col justify-between items-start text-md font-thin space-y-2">
                        <li className="text-md font-thin">
                          Full refund if canceled at the latest 24 hours before
                          the start of experience.
                        </li>
                      </ul>
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
                <span className="text-xl font-extrabold">Confirm and Pay</span>
              </div>
              <div className="grid grid-cols-12 w-full mt-8 space-x-16">
                <div className="col-span-7">
                  <div className="space-x-4 px-4 py-3 mb-6 w-full flex justify-start items-center border-solid border-[1px] rounded-xl border-neutral-500">
                    <div className="p-3 bg-rose-500 rounded-[50%]">
                      <FaBell size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-neutral-500 font-semibold">
                        This experience is held in English, Chinese
                        (simplicity), Chinese (phonetic)
                      </span>
                      <span className="text-neutral-400 font-thin">
                        Make sure it is the right language for you before
                        booking.
                      </span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="text-lg font-bold mb-6 block">
                      Your booking info
                    </span>
                    <Input
                      id="full_name"
                      label="Full Name"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                    />
                    <div className="flex gap-6 my-6">
                      <div className="flex-1">
                        <Input
                          id="phone"
                          label="Phone"
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
                          label="Email"
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
                      label="No Guest"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                      type="number"
                    />
                  </div>
                  <hr />
                  <div className="my-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-lg font-bold">
                        Only for you and your group
                      </span>
                      <span className="text-neutral-500 font-thin text-md">
                        Only allow separate experience for hours and day. Sumire
                        can organize their own groups with any scale, up to 6
                        guests. The price for a private group is from $ 33.{" "}
                      </span>
                    </div>
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
                        <label htmlFor="forMyself">Booking for myself</label>
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
                        <label htmlFor="forOther">Booking for other</label>
                      </div>
                    </div>
                    {bookingMode === BookingMode.ForOther && (
                      <Input
                        id="guest_name"
                        label="Guest Name"
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
                      Payment information
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
                                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                      <span className="text-md font-bold">Date</span>
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
                        Place max guest(s)
                      </span>
                      <span className="text-md font-thin">{0} guest(s)</span>
                    </div>
                  </div>
                  <hr />
                  <div className="my-6">
                    <span className="text-lg font-bold block">
                      Contact to vendor
                    </span>
                    <div className="flex justify-start items-center space-x-6 my-4">
                      <Image
                        width={40}
                        height={40}
                        src={emptyAvatar}
                        alt="Avatar"
                        className="rounded-full h-[40px] w-[40px]"
                        priority
                      />
                      <div>
                        <h1 className="text-md font-bold space-y-3">
                          {"User"}
                        </h1>
                        <p>
                          19/03/2024
                          {/* {currentUser?.created
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("/") || "-"} */}
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
                    <span className="text-lg font-bold">General rule</span>
                    <ul className="flex flex-col justify-between items-start mt-4 text-md font-thin">
                      We ask all guests to remember a few simple rules to be a
                      great guest.
                      <li className="text-md font-thin">
                        - Comply with house rules
                      </li>
                      <li className="text-md font-thin">
                        - Maintain the house as if it were your home
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <div className="w-full flex justify-between items-start space-x-4 my-6">
                    <FaBusinessTime size={64} />
                    <span className="text-lg font-semibold">
                      Your reservation/reservation will not be confirmed until
                      the host/organizer accepts your request (within 24 hours).
                      <span className="font-thin ml-2">
                        You will not be charged until then.
                      </span>
                    </span>
                  </div>
                  <hr />
                  <div className="w-1/3 mt-6">
                    <Button
                      disabled={isLoading}
                      label="Reservation"
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
                          src={emptyImage}
                          alt="room image"
                          className="rounded-xl aspect-square"
                          priority
                        />
                      </div>
                      <div className="w-[70%]">
                        <div className="space-y-1">
                          <p className="text-sm font-thin">Room</p>
                          <p className="text-md font-bold">{"Room Name"}</p>
                        </div>
                        <div className="flex items-center justify-start space-x-2">
                          <FaStar size={8} />
                          <span className="text-sm font-bold">5.0</span>
                          <span className="text-sm font-thin">
                            (4 comments)
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <span className="text-lg font-bold">Price details</span>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-md font-thin">
                          $ 0 x{dayCount ? dayCount : 1}
                        </span>
                        <span className="text-md font-thin">
                          $ {totalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-md font-thin">Service fee</span>
                        <span className="text-md font-thin">$ 0</span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-md font-bold">Total (USD):</span>
                      <span className="text-md font-bold">$ {totalPrice}</span>
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
                  className={`px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tl-xl rounded-bl-xl ${
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
                      Date
                    </span>
                    <span
                      className={`text-md font-thin ${
                        !isShowDateRange ? "text-neutral-400" : "text-white"
                      }`}
                    >
                      {dayCount > 0 ? dayCount + " (Days)" : "Add Date"}
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
                    !isShowMaxGuest ? "bg-white" : "bg-rose-500"
                  }`}
                  onClick={scrollToMaxGuestFilterSection}
                  ref={maxGuestFilterSection}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold ${
                        !isShowMaxGuest ? "text-neutral-500" : "text-white"
                      }`}
                    >
                      Max guest
                    </span>
                    <span
                      className={`text-md font-thin ${
                        !isShowMaxGuest ? "text-neutral-400" : "text-white"
                      }`}
                    >
                      {max_guest > 0
                        ? max_guest + " (Persons)"
                        : "Add Max Guests"}
                    </span>
                  </div>
                  {!isShowMaxGuest ? (
                    <FaAngleDown size={24} />
                  ) : (
                    <FaAngleUp size={24} className="text-white" />
                  )}
                </div>
                <div
                  ref={maxGuestPickerSection}
                  className={`${
                    !isShowMaxGuest
                      ? "hidden"
                      : "space-y-6 p-6 absolute top-[110%] left-0 z-10 w-[25vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden bg-white"
                  }`}
                >
                  <Counter
                    title="Guests"
                    subtitle="Max guest you have"
                    value={max_guest}
                    onChange={(value: number) =>
                      setCustomValue("max_guest", value)
                    }
                  />
                  {/* <hr />
                  <Counter
                    title="Beds"
                    subtitle="No beds you want"
                    value={num_bed}
                    onChange={(value: number) =>
                      setCustomValue("num_bed", value)
                    }
                  />
                  <hr />
                  <Counter
                    title="Bedrooms"
                    subtitle="No bedrooms you need?"
                    value={bed_room}
                    onChange={(value: number) =>
                      setCustomValue("bed_room", value)
                    }
                  /> */}
                  <Button
                    label="Save"
                    onClick={() => {
                      setPaymentMode(true);
                    }}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="flex justify-start items-start space-x-2 mt-8">
              <div className="w-[90%] flex flex-col space-y-1">
                <span className="text-lg font-bold">
                  Only display the existing status of the experience allowed to
                  place in a separate group
                </span>
                <span className="text-neutral-500 font-thin text-md">
                  Sumire can organize separate groups with a maximum size of 6
                  guests. The minimum price for a private group is $ 33.
                </span>
              </div>
              {/* <div
                // onClick={}
                className="mt-4 md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div
                    className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:bg-rose-500 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500"
                    onClick={handleChangeBookingMode}
                  ></div>
                </label>
              </div> */}
            </div>
          </div>
          <div className="bg-white w-[35vw] absolute right-0 top-10 max-h-[80vh] overflow-y-auto pr-2 vendor-room-listing">
            <div>
              <span className="font-semibold text-lg">Fri, 21/03/2024</span>
              <div>
                <div className="flex flex-col my-6 border-solid border-[1px] rounded-xl border-neutral-500">
                  <div className="flex justify-between items-center pt-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-thin text-sm">
                        21:00 - 21:30 (ICT)
                      </span>
                      <span className="text-md font-thin">
                        <span className="font-semibold">From $33</span> / group
                      </span>
                    </div>
                    <div className="w-[80px]">
                      <Button
                        medium
                        label="Choose"
                        onClick={() => {
                          setPaymentMode(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 px-6 flex flex-col space-y-1">
                    <span className="font-thin">Only for private group</span>
                    <span className="font-thin">
                      Organized in English, Chinese (simplicity) and Chinese
                      (phonetic)
                    </span>
                    <span className="font-thin">Do not refund.</span>
                  </div>
                  <div className="mt-6 bg-neutral-100 rounded-bl-xl rounded-br-xl p-2 px-6 justify-start items-center flex">
                    <div
                      className="flex items-center justify-between cursor-pointer relative"
                      onClick={scrollToShareOptionsSection}
                      ref={shareOptionsSection}
                    >
                      <AiOutlineShareAlt />
                      <span className="text-[16px] ml-2 underline">Share</span>
                      <div
                        ref={shareOptionsPickerSection}
                        className={`${
                          !isShowShareOptions
                            ? "hidden"
                            : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
                        }`}
                      >
                        <div className="col-span-1 space-y-4">
                          <div
                            className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
                            onClick={handleCopyToClipboard}
                          >
                            <FaCopy
                              size={30}
                              style={{ color: "#05a569", marginRight: 16 }}
                            />
                            Copy link
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <FacebookShareButton
                              url={currentUrl}
                              hashtag={"#ParadiseBookingApp"}
                              className="w-full flex items-center"
                            >
                              <FacebookIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Facebook
                            </FacebookShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TwitterShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴\n\n`}
                              url={currentUrl}
                              hashtags={["ParadiseBookingApp"]}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TwitterIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Twitter
                            </TwitterShareButton>
                          </div>
                        </div>
                        <div className="col-span-1 space-y-4">
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <EmailShareButton
                              subject="Paradise Booking Share"
                              body={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                  `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <EmailIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Email
                            </EmailShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <WhatsappShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                    `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <WhatsappIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Whatsapp
                            </WhatsappShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TelegramShareButton
                              title={`\n🌴🏖️ Explore the resort paradise at Paradise🏖️🌴`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <TelegramIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Telegram
                            </TelegramShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col my-6 border-solid border-[1px] rounded-xl border-neutral-500">
                  <div className="flex justify-between items-center pt-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-thin text-sm">
                        21:00 - 21:30 (ICT)
                      </span>
                      <span className="text-md font-thin">
                        <span className="font-semibold">From $33</span> / group
                      </span>
                    </div>
                    <div className="w-[80px]">
                      <Button
                        medium
                        label="Choose"
                        onClick={() => {
                          setPaymentMode(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 px-6 flex flex-col space-y-1">
                    <span className="font-thin">Only for private group</span>
                    <span className="font-thin">
                      Organized in English, Chinese (simplicity) and Chinese
                      (phonetic)
                    </span>
                    <span className="font-thin">Do not refund.</span>
                  </div>
                  <div className="mt-6 bg-neutral-100 rounded-bl-xl rounded-br-xl p-2 px-6 justify-start items-center flex">
                    <div
                      className="flex items-center justify-between cursor-pointer relative"
                      onClick={scrollToShareOptionsSection}
                      ref={shareOptionsSection}
                    >
                      <AiOutlineShareAlt />
                      <span className="text-[16px] ml-2 underline">Share</span>
                      <div
                        ref={shareOptionsPickerSection}
                        className={`${
                          !isShowShareOptions
                            ? "hidden"
                            : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
                        }`}
                      >
                        <div className="col-span-1 space-y-4">
                          <div
                            className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
                            onClick={handleCopyToClipboard}
                          >
                            <FaCopy
                              size={30}
                              style={{ color: "#05a569", marginRight: 16 }}
                            />
                            Copy link
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <FacebookShareButton
                              url={currentUrl}
                              hashtag={"#ParadiseBookingApp"}
                              className="w-full flex items-center"
                            >
                              <FacebookIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Facebook
                            </FacebookShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TwitterShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴\n\n`}
                              url={currentUrl}
                              hashtags={["ParadiseBookingApp"]}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TwitterIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Twitter
                            </TwitterShareButton>
                          </div>
                        </div>
                        <div className="col-span-1 space-y-4">
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <EmailShareButton
                              subject="Paradise Booking Share"
                              body={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                  `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <EmailIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Email
                            </EmailShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <WhatsappShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                    `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <WhatsappIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Whatsapp
                            </WhatsappShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TelegramShareButton
                              title={`\n🌴🏖️ Explore the resort paradise at Paradise🏖️🌴`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <TelegramIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Telegram
                            </TelegramShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="font-semibold text-lg">Fri, 21/03/2024</span>
              <div>
                <div className="flex flex-col my-6 border-solid border-[1px] rounded-xl border-neutral-500">
                  <div className="flex justify-between items-center pt-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-thin text-sm">
                        21:00 - 21:30 (ICT)
                      </span>
                      <span className="text-md font-thin">
                        <span className="font-semibold">From $33</span> / group
                      </span>
                    </div>
                    <div className="w-[80px]">
                      <Button
                        medium
                        label="Choose"
                        onClick={() => {
                          setPaymentMode(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 px-6 flex flex-col space-y-1">
                    <span className="font-thin">Only for private group</span>
                    <span className="font-thin">
                      Organized in English, Chinese (simplicity) and Chinese
                      (phonetic)
                    </span>
                    <span className="font-thin">Do not refund.</span>
                  </div>
                  <div className="mt-6 bg-neutral-100 rounded-bl-xl rounded-br-xl p-2 px-6 justify-start items-center flex">
                    <div
                      className="flex items-center justify-between cursor-pointer relative"
                      onClick={scrollToShareOptionsSection}
                      ref={shareOptionsSection}
                    >
                      <AiOutlineShareAlt />
                      <span className="text-[16px] ml-2 underline">Share</span>
                      <div
                        ref={shareOptionsPickerSection}
                        className={`${
                          !isShowShareOptions
                            ? "hidden"
                            : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
                        }`}
                      >
                        <div className="col-span-1 space-y-4">
                          <div
                            className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
                            onClick={handleCopyToClipboard}
                          >
                            <FaCopy
                              size={30}
                              style={{ color: "#05a569", marginRight: 16 }}
                            />
                            Copy link
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <FacebookShareButton
                              url={currentUrl}
                              hashtag={"#ParadiseBookingApp"}
                              className="w-full flex items-center"
                            >
                              <FacebookIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Facebook
                            </FacebookShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TwitterShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴\n\n`}
                              url={currentUrl}
                              hashtags={["ParadiseBookingApp"]}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TwitterIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Twitter
                            </TwitterShareButton>
                          </div>
                        </div>
                        <div className="col-span-1 space-y-4">
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <EmailShareButton
                              subject="Paradise Booking Share"
                              body={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                  `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <EmailIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Email
                            </EmailShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <WhatsappShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                    `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <WhatsappIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Whatsapp
                            </WhatsappShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TelegramShareButton
                              title={`\n🌴🏖️ Explore the resort paradise at Paradise🏖️🌴`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <TelegramIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Telegram
                            </TelegramShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col my-6 border-solid border-[1px] rounded-xl border-neutral-500">
                  <div className="flex justify-between items-center pt-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-thin text-sm">
                        21:00 - 21:30 (ICT)
                      </span>
                      <span className="text-md font-thin">
                        <span className="font-semibold">From $33</span> / group
                      </span>
                    </div>
                    <div className="w-[80px]">
                      <Button
                        medium
                        label="Choose"
                        onClick={() => {
                          setPaymentMode(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-6 px-6 flex flex-col space-y-1">
                    <span className="font-thin">Only for private group</span>
                    <span className="font-thin">
                      Organized in English, Chinese (simplicity) and Chinese
                      (phonetic)
                    </span>
                    <span className="font-thin">Do not refund.</span>
                  </div>
                  <div className="mt-6 bg-neutral-100 rounded-bl-xl rounded-br-xl p-2 px-6 justify-start items-center flex">
                    <div
                      className="flex items-center justify-between cursor-pointer relative"
                      onClick={scrollToShareOptionsSection}
                      ref={shareOptionsSection}
                    >
                      <AiOutlineShareAlt />
                      <span className="text-[16px] ml-2 underline">Share</span>
                      <div
                        ref={shareOptionsPickerSection}
                        className={`${
                          !isShowShareOptions
                            ? "hidden"
                            : "absolute grid grid-cols-2 space-x-4 px-6 py-5 top-[110%] right-0 z-10 w-[25vw] bg-white shadow-xl rounded-2xl border-[1px] border-[#f2f2f2]"
                        }`}
                      >
                        <div className="col-span-1 space-y-4">
                          <div
                            className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]"
                            onClick={handleCopyToClipboard}
                          >
                            <FaCopy
                              size={30}
                              style={{ color: "#05a569", marginRight: 16 }}
                            />
                            Copy link
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <FacebookShareButton
                              url={currentUrl}
                              hashtag={"#ParadiseBookingApp"}
                              className="w-full flex items-center"
                            >
                              <FacebookIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Facebook
                            </FacebookShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TwitterShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴\n\n`}
                              url={currentUrl}
                              hashtags={["ParadiseBookingApp"]}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TwitterIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Twitter
                            </TwitterShareButton>
                          </div>
                        </div>
                        <div className="col-span-1 space-y-4">
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <EmailShareButton
                              subject="Paradise Booking Share"
                              body={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                  `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <EmailIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Email
                            </EmailShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <WhatsappShareButton
                              title={`🌴🏖️ Explore the resort paradise at Paradise🏖️🌴
                    `}
                              separator={`\n`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <WhatsappIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Whatsapp
                            </WhatsappShareButton>
                          </div>
                          <div className="flex items-center w-full border-[1px] border-neutral-400 rounded-xl px-3 py-2 hover:bg-rose-500 hover:text-[white]">
                            <TelegramShareButton
                              title={`\n🌴🏖️ Explore the resort paradise at Paradise🏖️🌴`}
                              url={currentUrl}
                              className="w-full flex items-center"
                            >
                              <TelegramIcon
                                size={32}
                                round
                                style={{ marginLeft: 0, marginRight: 16 }}
                              />
                              Telegram
                            </TelegramShareButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PostGuiderClient;
