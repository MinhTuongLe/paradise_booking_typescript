/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  Fragment,
  useRef,
  useCallback,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookie from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { differenceInCalendarDays, formatISO, setDate } from "date-fns";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { DateRangePicker } from "react-date-range";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { isEmpty } from "lodash";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import "../../../../styles/globals.css";
import {
  API_URL,
  classNames,
  offers,
  emptyAvatar,
  formatDateTimeType,
  maxPrice,
  formatTimeType,
  formatDateType,
  booking_guider_status,
} from "@/const";
import ImageUpload from "@/components/inputs/ImageUpload";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import { Amenity, DateRange, Place, Reservation } from "@/models/place";
import { Pagination, PlaceDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import Counter from "@/components/inputs/Counter";
import {
  BookingGuider,
  CalendarPostGuider,
  CreateCalendarPostGuiderDataSubmit,
  PostGuider,
  UpdatePostGuiderDataSubmit,
} from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import dayjs from "dayjs";
import RangeSlider from "@/components/RangeSlider";
import { getPriceFormated } from "@/utils/getPriceFormated";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { formatDateTime_DMYHMS_To_ISO8601 } from "@/utils/datetime";
import { Role } from "@/enum";
import { getOwnerName } from "@/utils/getUserInfo";

const steps = {
  GENERAL: 1,
  AMENITIES: 2,
  POLICIES: 3,
  SCHEDULE: 4,
};

export interface MyPostGuiderClientProps {
  data: PostGuider | undefined;
  postGuiderId: string | number;
  calendar: CalendarPostGuider[];
  calendarPaging: Pagination;
  reservations: BookingGuider[];
}

const MyPostGuiderClient: React.FC<MyPostGuiderClientProps> = ({
  data,
  postGuiderId,
  calendar,
  calendarPaging,
  reservations,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const { t } = useTranslation("translation", { i18n });

  let currentDate = new Date();
  let nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);

  let next2Date = new Date(currentDate);
  next2Date.setDate(currentDate.getDate() + 2);

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
  const [checkinTime, setCheckinTime] = useState<any>(
    dayjs(nextDate, { locale: "en", format: formatDateType.YMD }).format(
      formatDateTimeType.YMD_T_HMS
    )
  );
  const [checkoutTime, setCheckoutTime] = useState<any>(
    dayjs(next2Date, { locale: "en", format: formatDateType.YMD }).format(
      formatDateTimeType.YMD_T_HMS
    )
  );
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<CalendarPostGuider>();

  const [safePolicy, setSafePolicy] = useState("");
  const [cancelPolicy, setCancelPolicy] = useState("");
  const [thingsGuestWillDo, setThingsGuestWillDo] = useState("");
  const [planningStep, setPlanningStep] = useState("");
  const [planningSteps, setPlanningSteps] = useState("");
  const [lat, setLat] = useState<number>(data?.lat || 51);
  const [lng, setLng] = useState<number>(data?.lng || -0.09);
  const [editSchedule, setEditSchedule] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState<number>(1);
  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [isShowPriceRange, setIsShowPriceRange] = useState(false);
  const dateRangeFilterSection = useRef<HTMLDivElement>(null);
  const dateRangePickerSection = useRef<HTMLDivElement>(null);
  const priceRangeFilterSection = useRef<HTMLDivElement>(null);
  const priceRangePickerSection = useRef<HTMLDivElement>(null);
  const addScheduleSection = useRef<HTMLDivElement>(null);

  const [dayCount, setDayCount] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [price_from, setPriceFrom] = useState(0);
  const [price_to, setPriceTo] = useState(maxPrice);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data?.title,
      description: data?.description,
      lat: data?.lat,
      lng: data?.lng,
      cover: data?.cover || "",
      topic_id: data?.topic_id,
      address: data?.address,
    },
    mode: "all",
  });

  const cover = watch("cover");

  const setCustomValue = (id: any, value: File | number | null) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    getValues: getValues2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      post_guide_id: loggedUser?.id!,
      guider_id: data?.id!,
      note: "",
      date_from: "",
      date_to: "",
      price_per_person: 0,
      max_guest: 1,
    },
    mode: "all",
  });

  const setCustomValue2 = (id: any, value: number | string | null) => {
    setValue2(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../../../../components/Map"), {
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

      const imageUrl = response.data.data.url;
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
    console.log("status_id: ", status_id);
    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const config = {
      params: {
        booking_guider_id: booking_id,
        status: status_id,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .put(getApiRoute(RouteKey.BookingGuider), null, config)
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

  const onSubmit: SubmitHandler<UpdatePostGuiderDataSubmit> = async (
    newData: UpdatePostGuiderDataSubmit
  ) => {
    try {
      setIsLoading(true);

      if (currentStep === steps.GENERAL) {
        // upload photo
        let imageUrl: string | undefined = "";
        if (newData?.cover) {
          const file = newData.cover;
          if (typeof file === "string") {
            imageUrl = data?.cover;
          } else {
            imageUrl = await handleFileUpload(file);
          }
        }

        // const { country, city, address } = processSearchResult();

        const submitValues = {
          title: newData?.title || "",
          description: newData?.description || "",
          address: newData?.address || data?.address,
          lat: lat || data?.lat,
          lng: lng || data?.lng,
          cover: imageUrl || "",
          topic_id: newData?.topic_id || data?.topic_id,
        };

        const accessToken = Cookie.get("accessToken");
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            id: postGuiderId,
          },
        };
        axios
          .put(getApiRoute(RouteKey.PostGuiders), submitValues, config)
          .then(() => {
            setIsLoading(false);
            toast.success(t("toast.update-post-successfully"));
            router.refresh();
          })
          .catch((err) => {
            console.log(err);
            toast.error(t("toast.update-post-failed"));
            setIsLoading(false);
          });
      } else if (currentStep === steps.AMENITIES) {
        // const accessToken = Cookie.get("accessToken");
        // const config = {
        //   headers: {
        //     "content-type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // };
        // const newItems = newSelectedAmenities.filter(
        //   (item) =>
        //     !selectedAmenities.some(
        //       (selectedItem: Amenity) => selectedItem.description === item.name
        //     )
        // );
        // const oldItems = notSelectedAmenities.filter((item) =>
        //   selectedAmenities.some(
        //     (selectedItem: Amenity) => selectedItem.description === item.name
        //   )
        // );
        // const submitValues = {
        //   place_id: data?.id,
        //   list_detail_amenity: newItems.map((item) => ({
        //     description: item.description || item.name,
        //     config_amenity_id: item.id,
        //   })),
        // };
        // const submitValues_2 = {
        //   place_id: data?.id,
        //   list_config_amenity_id: oldItems.map((item) => item.id),
        // };
        // const response_create = await axios.post(
        //   `${API_URL}/amenities`,
        //   submitValues,
        //   config
        // );
        // const response_remove = await axios.post(
        //   `${API_URL}/amenities/place/remove`,
        //   submitValues_2,
        //   config
        // );
        // if (
        //   response_create.data.data === true &&
        //   response_remove.data.data === true
        // ) {
        //   toast.success("Update Amenities Successfully");
        //   await getAmenities();
        //   router.refresh();
        // } else {
        //   toast.error("Update Amenities Failed");
        // }
        // setIsLoading(false);
      } else {
        // console.log(checkinTime, checkoutTime, safePolicy, cancelPolicy);
        // const submitValues = {
        //   place_id: data?.id,
        //   list_policy: [
        //     {
        //       group_policy_id: 1,
        //       name: `Checkin after: ${checkinTime}. Checkout before: ${checkoutTime}`,
        //     },
        //     {
        //       group_policy_id: 2,
        //       name: safePolicy,
        //     },
        //     {
        //       group_policy_id: 3,
        //       name: cancelPolicy,
        //     },
        //   ],
        // };
        // console.log(submitValues);
        // const accessToken = Cookie.get("accessToken");
        // const config = {
        //   headers: {
        //     "content-type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // };
        // axios
        //   .post(`${API_URL}/policies`, { data: submitValues }, config)
        //   .then(() => {
        //     toast.success("Update Policies Successfully");
        //     router.refresh();
        //   })
        //   .catch((err) => {
        //     toast.error("Update Policies Failed");
        //   });
        // setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateCalendar: SubmitHandler<
    CreateCalendarPostGuiderDataSubmit
  > = async (newData: CreateCalendarPostGuiderDataSubmit) => {
    try {
      setIsLoading(true);

      const submitValues = {
        guider_id: loggedUser?.id!,
        post_guide_id: data?.id!,
        note: newData.note,
        date_from: dayjs(checkinTime || nextDate.toISOString()).format(
          formatDateTimeType.DMY_HMS2
        ),
        date_to: dayjs(checkoutTime || next2Date.toISOString()).format(
          formatDateTimeType.DMY_HMS2
        ),
        price_per_person: Number(newData.price_per_person) || 0,
        max_guest: Number(newData.max_guest),
      };

      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Create new calendar post guider
      if (!editSchedule) {
        axios
          .post(getApiRoute(RouteKey.CalendarGuider), submitValues, config)
          .then(() => {
            setIsLoading(false);
            toast.success("Create new calendar successfully");
            reset2();
            setEditSchedule(null);
            setCheckinTime(
              dayjs(nextDate, {
                locale: "en",
                format: formatDateType.YMD,
              }).format(formatDateTimeType.YMD_T_HMS)
            );
            setCheckoutTime(
              dayjs(next2Date, {
                locale: "en",
                format: formatDateType.YMD,
              }).format(formatDateTimeType.YMD_T_HMS)
            );
            router.refresh();
          })
          .catch((err) => {
            toast.error("Create new calendar failed");
            setIsLoading(false);
          });
      }
      // Update calendar post guider
      else {
        axios
          .put(getApiRoute(RouteKey.CalendarGuider), submitValues, {
            ...config,
            params: {
              id: item?.id,
            },
          })
          .then(() => {
            setIsLoading(false);
            toast.success("Update calendar successfully");
            reset2();
            setEditSchedule(null);
            setCheckinTime(
              dayjs(nextDate, {
                locale: "en",
                format: formatDateType.YMD,
              }).format(formatDateTimeType.YMD_T_HMS)
            );
            setCheckoutTime(
              dayjs(next2Date, {
                locale: "en",
                format: formatDateType.YMD,
              }).format(formatDateTimeType.YMD_T_HMS)
            );
            router.refresh();
          })
          .catch((err) => {
            toast.error("Update calendar failed");
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (item: CalendarPostGuider) => {
    setItem(item);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    setIsLoading(true);

    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .delete(
        getApiRoute(RouteKey.CalendarGuiderDetails, {
          calendarId: item.id,
        }),
        config
      )
      .then(() => {
        setOpen(false);
        toast.success("Delete calendar successfully");
        router.refresh();
      })
      .catch((err) => {
        toast.error("Delete calendar failed");
      })
      .finally(() => setIsLoading(false));
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
      .get(`${API_URL}/amenities/place/${data?.id}`)
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
      .get(`${API_URL}/policies/${data?.id}`)
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

  const scrollToAddScheduleSection = () => {
    if (addScheduleSection.current) {
      addScheduleSection.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const onSubmitCallback = (minValue: number, maxValue: number) => {
    setPriceFrom(minValue);
    setPriceTo(maxValue);
  };

  const get = async () => {
    await getDefaultAmenities();
    await getAmenities();
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
        url: pathName || `/post-guiders/mine/${data?.id}`,
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, dateRange, price_from, price_to, params]);

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
      url: pathName || `/post-guiders/mine/${data?.id}`,
      query: {},
    });

    router.push(url);
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
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    if (currentStep === steps.AMENITIES) get();
    else if (currentStep === steps.POLICIES) getPolicies();
  }, [currentStep]);

  if (!authState || !loggedUser || loggedUser?.role !== Role.Guider) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  } else if (!data) {
    return <EmptyState title="No data" subtitle="No place data to display" />;
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        content={t("general.calendar")}
      />
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="border-b-solid border-b-neutral-500 border-b-[1px] pb-12">
          <h1 className="text-2xl font-bold mt-10 mb-4">
            {currentStep === steps.GENERAL ? (
              <>
                {t("property-feature.general-information")}
                {/* {" "}
            {data?.is_booked && (
              <span className="text-rose-500 font-extrabold">
                (Full of rooms)
              </span>
            )} */}
              </>
            ) : currentStep === steps.AMENITIES ? (
              t("property-feature.amenities-information")
            ) : currentStep === steps.POLICIES ? (
              t("property-feature.policies-information")
            ) : (
              t("post-guider-feature.schedule-information")
            )}
          </h1>
          {currentStep === steps.GENERAL && (
            <>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <div className="pb-8 space-y-6">
                    <Input
                      id="title"
                      label={t("general.title")}
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                    />
                    <Input
                      id="description"
                      label={t("general.description")}
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                      required
                    />
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
                        {t("property-feature.amenities-settings")}
                      </span>
                      <span
                        className="font-semibold text-[#222] text-lg underline cursor-pointer hover:text-rose-500"
                        onClick={() => setCurrentStep(steps.POLICIES)}
                      >
                        {t("property-feature.policies-settings")}
                      </span>
                      <span
                        className="font-semibold text-[#222] text-lg underline cursor-pointer hover:text-rose-500"
                        onClick={() => setCurrentStep(steps.SCHEDULE)}
                      >
                        {t("post-guider-feature.schedule-settings")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 space-y-6">
                  <Input
                    id="address"
                    label={t("general.address")}
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
                          : `${
                              data?.location?.district
                                ? data?.location?.district + ", "
                                : ""
                            } ${
                              data?.location?.state
                                ? data?.location?.state + ", "
                                : ""
                            } ${data?.location?.country || "-"}`
                      }
                      id="_location"
                      readOnly={true}
                      className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 cursor-not-allowed border-neutral-300 focus:outline-none`}
                    />
                    <label
                      className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                    >
                      {t("property-feature.district-state-and-country")}
                    </label>
                  </div>
                  <Map
                    center={[lat, lng]}
                    onSearchResult={handleSearchResult}
                  />
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6">
                      <Button
                        outline
                        label={t("general.cancel")}
                        onClick={() => {
                          reset();
                          router.push("/post-guiders/mine");
                        }}
                      />
                    </div>
                    <div className="col-span-6">
                      <Button
                        disabled={isLoading}
                        label={t("general.update")}
                        onClick={handleSubmit(onSubmit)}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                          (selected: Amenity) =>
                            selected.description === item.name
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
                              onChange={(e) =>
                                handleAmenityCheckboxChange(e, item)
                              }
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
                      // onClick={handleSubmit(onSubmit)}
                      onClick={() => console.log("onClick")}
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
                  <div className="grid grid-cols-12 gap-x-12 mb-8">
                    <div className="col-span-6">
                      <span className="text-xl font-bold text-[#222] block mb-4">
                        Rules to guests
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
                          // onClick={handleSubmit(onSubmit)}
                          onClick={() => console.log("onClick")}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {currentStep === steps.SCHEDULE && (
            <>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {/* <div className="gap-x-12 mb-8">
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
              </div> */}

                  <div className="grid grid-cols-12 gap-x-12 mb-8">
                    <div className="col-span-6">
                      <span className="text-xl font-bold text-[#222] block mb-4">
                        Things guests will do
                      </span>
                      <div className="flex justify-between items-center space-x-8">
                        <textarea
                          className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[400px] resize-none"
                          placeholder="Content ..."
                          value={thingsGuestWillDo}
                          onChange={(e) => setThingsGuestWillDo(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <span className="text-xl font-bold text-[#222] block mb-4">
                        Planning steps
                      </span>
                      <div className="mb-3 flex flex-col items-end space-y-2">
                        <textarea
                          disabled
                          className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
                          placeholder="No planning steps ..."
                          value={planningSteps}
                        ></textarea>
                        <div className="w-[40%]">
                          <Button
                            outline
                            label="Clear all"
                            onClick={() => {
                              setPlanningSteps("");
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-10">
                        <textarea
                          className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
                          placeholder="Content ..."
                          value={planningStep}
                          onChange={(e) => setPlanningStep(e.target.value)}
                        ></textarea>
                        <div className="w-full flex justify-between items-center space-x-4">
                          <div className="w-[50%]">
                            <Button
                              outline
                              label="Clear"
                              onClick={() => {
                                setPlanningStep("");
                              }}
                            />
                          </div>
                          <div className="w-[50%]">
                            <Button
                              label="Add step"
                              onClick={() => {
                                setPlanningSteps((prev) =>
                                  prev + prev !== "" ? "\n" : "" + planningStep
                                );
                                setPlanningStep("");
                              }}
                            />
                          </div>
                        </div>
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
                            setThingsGuestWillDo("");
                            setCurrentStep(steps.GENERAL);
                          }}
                        />
                      </div>
                      <div className="w-1/2">
                        <Button
                          disabled={isLoading}
                          label="Update"
                          // onClick={handleSubmit(onSubmit)}
                          onClick={() => console.log("onClick")}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div
          className="mt-10 border-b-solid border-b-neutral-500 border-b-[1px] pb-12"
          ref={addScheduleSection}
        >
          <h1 className="text-2xl font-bold mt-10 mb-4">
            {t("post-guider-feature.calendar-information")}
          </h1>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <div className="pb-8 space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="w-full relative col-span-6">
                    <input
                      required
                      onChange={(e) => setCheckinTime(e.target.value)}
                      type="datetime-local"
                      value={checkinTime}
                      id="date_from"
                      className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
                    />
                    <label
                      className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                    >
                      {t("general.from")}
                    </label>
                  </div>
                  <div className="w-full relative col-span-6">
                    <input
                      required
                      onChange={(e) => setCheckoutTime(e.target.value)}
                      type="datetime-local"
                      value={checkoutTime}
                      id="date_to"
                      className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
                    />
                    <label
                      className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
                    >
                      {t("general.to")}
                    </label>
                  </div>
                </div>
                <Input
                  id="note"
                  label={t("general.note")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  required
                />
              </div>
            </div>
            <div className="col-span-6 space-y-6">
              <Input
                id="price_per_person"
                label={t("post-guider-feature.price-per-person")}
                formatPrice
                type="number"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
              />
              <Input
                id="max_guest"
                label={t("property-feature.max-guests")}
                disabled={isLoading}
                register={register2}
                errors={errors2}
                type="number"
                required
                mustBeInteger={true}
              />
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <Button
                    outline
                    label={t("general.cancel")}
                    onClick={() => {
                      reset2();
                      setEditSchedule(null);
                      setCheckinTime(
                        dayjs(nextDate, {
                          locale: "en",
                          format: formatDateType.YMD,
                        }).format(formatDateTimeType.YMD_T_HMS)
                      );
                      setCheckoutTime(
                        dayjs(next2Date, {
                          locale: "en",
                          format: formatDateType.YMD,
                        }).format(formatDateTimeType.YMD_T_HMS)
                      );
                    }}
                  />
                </div>
                <div className="col-span-6">
                  <Button
                    disabled={isLoading}
                    label={
                      !editSchedule ? t("general.create") : t("general.save")
                    }
                    onClick={handleSubmit2(onCreateCalendar)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-b-solid border-b-neutral-500 border-b-[1px] pb-12">
          <h1 className="text-2xl font-bold mt-10 mb-4">
            {t("navbar.my-post-guiders")}
          </h1>
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div className="bg-white w-[30vw] z-10">
                <div className="flex gap-6 my-6">
                  <div className="flex-1 flex gap-6 justify-start items-center">
                    <input
                      type="radio"
                      id="forMyself"
                      name="isBooked"
                      value={isBooked}
                      onChange={() => setIsBooked(0)}
                      defaultChecked={isBooked === 0}
                      className="w-[20px] h-[20px]"
                      required
                    />
                    <label htmlFor="forMyself">{t("booking-status.all")}</label>
                  </div>
                  <div className="flex-1 flex gap-6 justify-start items-center">
                    <input
                      type="radio"
                      id="forMyself"
                      name="isBooked"
                      value={isBooked}
                      onChange={() => setIsBooked(1)}
                      defaultChecked={isBooked === 1}
                      className="w-[20px] h-[20px]"
                      required
                    />
                    <label htmlFor="forMyself">{t("components.booked")}</label>
                  </div>
                  <div className="flex-1 flex gap-6 justify-start items-center">
                    <input
                      type="radio"
                      id="forOther"
                      name="isBooked"
                      value={isBooked}
                      onChange={() => setIsBooked(2)}
                      defaultChecked={isBooked === 2}
                      className="w-[20px] h-[20px]"
                      required
                    />
                    <label htmlFor="forOther">
                      {t("post-guider-feature.free")}
                    </label>
                  </div>
                </div>
                <hr />
                <div className="mx-auto grid grid-cols-2 divide-x border-solid border-[1px] border-neutral-500 rounded-xl mt-6 mb-10">
                  <div className="flex justify-between items-center relative">
                    <div
                      className={`h-full px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tl-xl rounded-bl-xl ${
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
                          : "absolute top-[110%] left-0 z-10 w-[40vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
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
                      className={`h-full px-5 py-3 cursor-pointer flex justify-between items-center w-full rounded-tr-xl rounded-br-xl ${
                        !isShowPriceRange ? "bg-white" : "bg-rose-500"
                      }`}
                      onClick={scrollToPriceRangeFilterSection}
                      ref={priceRangeFilterSection}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold ${
                            !isShowPriceRange
                              ? "text-neutral-500"
                              : "text-white"
                          }`}
                        >
                          {t("general.price-range")}
                        </span>
                        <span
                          className={`text-md font-thin ${
                            !isShowPriceRange
                              ? "text-neutral-400"
                              : "text-white"
                          }`}
                        >
                          {`${getPriceFormated(
                            Number(price_from)
                          )} VND - ${getPriceFormated(
                            Number(price_to)
                          )} VND`}{" "}
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
                          : "absolute top-[110%] right-0 z-10 w-[30vw] shadow-xl shadow-neutral-500 rounded-xl overflow-hidden"
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
                <div className="flex space-x-6">
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
              </div>
            </div>
            <div className="col-span-1">
              <div className="mt-10 bg-white max-h-[80vh] overflow-y-auto pr-2 vendor-room-listing">
                <div>
                  {calendar &&
                    calendar.length > 0 &&
                    calendar.map((element: CalendarPostGuider) => (
                      <div
                        key={element.id}
                        className="flex flex-col mt-6 border-solid border-[1px] rounded-xl border-neutral-500"
                      >
                        <div className="flex justify-between items-center pt-6 px-6">
                          <div className="flex flex-col">
                            <span className="font-thin text-sm">
                              {element.date_from} - {element.date_to}
                            </span>
                            <span className="text-md font-thin">
                              <span className="font-semibold">
                                {t("general.from")}{" "}
                                {getPriceFormated(element?.price || 0)} VND
                              </span>{" "}
                              / {t("post-guider-feature.person")}
                            </span>
                          </div>
                          <div className="w-[80px]">
                            {!editSchedule && (
                              <div className="space-y-4">
                                <Button
                                  medium
                                  label={t("general.update")}
                                  onClick={() => {
                                    setItem(element);
                                    setEditSchedule(1);
                                    scrollToAddScheduleSection();
                                    setCustomValue2(
                                      "max_guest",
                                      element.max_guest
                                    );
                                    setCustomValue2(
                                      "price_per_person",
                                      element.price
                                    );
                                    setCheckinTime(
                                      formatDateTime_DMYHMS_To_ISO8601(
                                        element.date_from
                                      )
                                    );
                                    setCheckoutTime(
                                      formatDateTime_DMYHMS_To_ISO8601(
                                        element.date_to
                                      )
                                    );
                                    setCustomValue2("note", element.note);
                                  }}
                                />
                                <Button
                                  outline
                                  medium
                                  label={t("components.delete")}
                                  onClick={() => {
                                    onDelete(element);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="py-6 px-6 flex flex-col space-y-1">
                          <span className="font-thin">
                            {t("post-guider-feature.for-up-to")}{" "}
                            {element.max_guest} {t("components.guests")}
                          </span>
                          <span className="font-thin">{element.note}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-bold mb-4">My Booked Calendar</h1>
          {reservations && !isEmpty(reservations) ? (
            reservations?.map((item: BookingGuider, index: number) => {
              return (
                <div key={index} className="mt-10">
                  <hr />
                  <div className="mt-12">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[16px]">
                          {`${data?.address ? data?.address + ", " : ""} ${
                            data?.location?.district
                              ? data?.location.district + ", "
                              : ""
                          } ${
                            data?.location.state
                              ? data?.location.state + ", "
                              : ""
                          } ${data?.location.country || ""}`}
                        </span>
                        <span className="text-[#828080] font-bold">
                          Booking ID: {item.id} - Calendar ID:{" "}
                          {item.calendar_guider_id}
                        </span>
                      </div>
                      <div className="mt-3 rounded-xl border-[#cdcdcd] border-[1px]">
                        <div className="flex justify-between items-center border-b-[#cdcdcd] border-b-[1px] p-4">
                          <Listbox
                            value={booking_guider_status.map(
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
                                      {booking_guider_status.map(
                                        (status) =>
                                          status.id === item.status_id &&
                                          status?.icon && (
                                            <div key={status.id}>
                                              {React.createElement(
                                                status.icon,
                                                {
                                                  size: 24,
                                                  className: `text-${status.color}`,
                                                  color: status.color,
                                                }
                                              )}
                                            </div>
                                          )
                                      )}
                                      <span className="ml-3 block truncate">
                                        {booking_guider_status.map(
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
                                      {booking_guider_status.map((person) => (
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
                                                        color: person.color,
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
                              {getPriceFormated(item?.total_price || 0)} VND
                            </span>
                          </div>
                        </div>
                        <div className="border-b-[#cdcdcd] border-b-[1px] p-4 w-full">
                          <div className="text-[#828080] font-bold text-[14px] mb-2">
                            USER INFORMATION
                          </div>
                          <div className="flex justify-start items-start space-x-6 w-full">
                            <div className="w-[60%]">
                              <div className="flex justify-between items-start w-full space-x-12">
                                <div>
                                  <div className="text-[16px] font-semibold">
                                    Fullname:{" "}
                                    <span className="ml-1 font-normal">
                                      {item?.name ? item.name : "User"}
                                    </span>
                                  </div>
                                  <div className="text-[16px] font-semibold">
                                    Email:
                                    <span className="ml-1 font-normal">
                                      {item.email || "-"}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[16px] font-semibold">
                                    With
                                    <span className="ml-1 font-normal">
                                      {item.number_of_people || 0} people
                                    </span>
                                  </div>
                                  <div className="text-[16px] font-semibold">
                                    Phone:
                                    <span className="ml-1 font-normal">
                                      {item.phone || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {item?.note && (
                                <div className="text-[16px] font-semibold">
                                  Content from{" "}
                                  {item.post_guide.post_owner
                                    ? getOwnerName(item.post_guide.post_owner)
                                    : "Guider"}
                                  :
                                  <span className="ml-1 font-normal">
                                    {item.note || "-"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start items-center space-x-[100px] border-b-[#cdcdcd] border-b-[1px] p-4">
                          <div className="text-[16px] font-semibold">
                            To:{" "}
                            {dayjs(item.calendar_guider.date_from).format(
                              formatDateTimeType.DMY_HMS
                            )}
                          </div>
                          <div className="text-[16px] font-semibold">
                            From:{" "}
                            {dayjs(item.calendar_guider.date_to).format(
                              formatDateTimeType.DMY_HMS
                            )}
                          </div>
                        </div>
                        <div className="flex justify-start items-center space-x-32 p-4">
                          <div className="">
                            <div className="text-[#828080] font-bold text-[14px]">
                              BOOKED ON
                            </div>
                            <div className="text-[16px] font-semibold">
                              {dayjs(item.created_at).format(
                                formatDateTimeType.DMY_HMS
                              )}
                            </div>
                          </div>
                          <div className="">
                            <div className="text-[#828080] font-bold text-[14px]">
                              PAYMENT METHOD
                            </div>
                            <div className="text-[16px] font-semibold">
                              {item.payment_method}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-xl font-bold text-rose-500">
              No calendar booked at this post
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPostGuiderClient;
