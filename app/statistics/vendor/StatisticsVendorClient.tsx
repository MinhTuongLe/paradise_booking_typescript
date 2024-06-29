"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { CreditCard, DollarSign, Users } from "lucide-react";
import qs from "query-string";
import dayjs from "dayjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { debounce } from "lodash";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import { Role, StatisticFilterSelection } from "@/enum";
import Card, { CardProps } from "@/components/statistics/Card";
import { classNames, formatDateType, minSearchTextLength } from "@/const";
import PopupTable from "@/components/statistics/PopupTable";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import Button from "@/components/Button";
import { getPriceFormated } from "@/utils/getPriceFormated";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      stacked: false,
    },
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

interface StatisticsVendorClientProps {
  places: Place[];
  paging: Pagination;
}

function StatisticsVendorClient({
  places,
  paging,
}: StatisticsVendorClientProps) {
  const { t } = useTranslation("translation", { i18n });
  const params = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const filterOptions = [
    {
      label: t("statistic-feature.by-dates"),
      value: StatisticFilterSelection.DATES,
    },
    {
      label: t("statistic-feature.by-weeks"),
      value: StatisticFilterSelection.WEEKS,
    },
    {
      label: t("statistic-feature.by-months"),
      value: StatisticFilterSelection.MONTHS,
    },
    {
      label: t("statistic-feature.by-years"),
      value: StatisticFilterSelection.YEARS,
    },
  ];

  const cardData: CardProps[] = [
    {
      label: t("statistic-feature.total-revenue-label"),
      amount: getPriceFormated(1000000) ?? 0 + " VND",
      discription: t("statistic-feature.total-revenue-desc"),
      icon: DollarSign,
    },
    {
      label: t("statistic-feature.total-bookings-label"),
      amount: getPriceFormated(500),
      discription: t("statistic-feature.total-bookings-desc"),
      icon: Users,
    },
    {
      label: t("statistic-feature.total-cancelations-label"),
      amount: getPriceFormated(10),
      discription: t("statistic-feature.total-cancelations-desc"),
      icon: CreditCard,
    },
  ];

  const filteredBarData = {
    labels,
    datasets: [
      {
        label: t("statistic-feature.bookings"),
        data: labels.map((value, index) => (index + 1) * 1000),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: t("statistic-feature.cancelation"),
        data: labels.map((value, index) => (index + 1) * 800),
        backgroundColor: "rgba(244, 63, 94, 0.5)",
        borderColor: "rgb(244, 63, 94)",
        borderWidth: 1,
      },
    ],
  };

  const filteredLineData = {
    labels,
    datasets: [
      {
        type: "line",
        label: t("statistic-feature.revenue"),
        data: labels.map((value, index) => (index + 1) * 500),
        borderColor: "rgba(53, 162, 235, 0.5)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
      },
    ],
  };

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterDataSource, setFilterDataSource] = useState(
    StatisticFilterSelection.DATES
  );
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [keyword, setKeyword] = useState("");

  const [isShowPopup, setIsShowPopup] = useState(false);

  const popupSearchRef = useRef<HTMLDivElement | null>(null);
  const tablePopupDataRef = useRef<HTMLDivElement | null>(null);

  const updateURL = (keyword: string) => {
    let updatedQuery = {};
    let currentQuery;

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      place_id: keyword ? keyword : null,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName || "/statistics/vendor",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const doSearchByKeyword = (keyword: string) => {
    if (keyword.length >= minSearchTextLength) {
      updateURL(keyword);
      setIsShowPopup(true);
    }
  };

  // delay 100ms để upload search
  const handleChangeValueDebounced = debounce((value) => {
    doSearchByKeyword(value);
  }, 100);

  const handleChangeInputSearch = (e: any) => {
    const { value } = e.target;
    setKeyword(value);

    if (value.length >= minSearchTextLength) {
      handleChangeValueDebounced(value);
    }
  };

  const handleFromDateChange = useCallback((event: any) => {
    setFilterFromDate(event.target.value);
  }, []);

  const handleDataSourceChange = useCallback((event: any) => {
    setFilterDataSource(event?.value);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        tablePopupDataRef.current &&
        !tablePopupDataRef.current.contains(event.target) &&
        popupSearchRef.current &&
        !popupSearchRef.current.contains(event.target)
      ) {
        console.log("out clicked");
        setIsShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilter = () => {
    console.log("selectedRoom: ", selectedRoom);
    console.log("filterFromDate: ", filterFromDate);
    let date_to = "";

    switch (filterDataSource) {
      case StatisticFilterSelection.DATES:
        date_to = dayjs(filterFromDate)
          .add(7, "day")
          .format(formatDateType.YMD);
        break;
      case StatisticFilterSelection.WEEKS:
        date_to = dayjs(filterFromDate)
          .add(12, "week")
          .format(formatDateType.YMD);
        break;
      case StatisticFilterSelection.MONTHS:
        date_to = dayjs(filterFromDate)
          .add(12, "month")
          .format(formatDateType.YMD);
        break;
      case StatisticFilterSelection.YEARS:
        date_to = dayjs(filterFromDate)
          .add(10, "year")
          .format(formatDateType.YMD);
        break;
      default:
        break;
    }

    console.log("date_to: ", date_to);
  };

  const handleClearAllFilters = () => {
    setFilterFromDate("");
    setFilterDataSource(StatisticFilterSelection.DATES);
    setSelectedRoom("");
    setIsShowPopup(false);
  };

  if (!authState || loggedUser?.role !== Role.Vendor) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="w-[100%] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      <Container>
        <div className="mt-10">
          <Heading
            title={t("statistic-feature.statistics")}
            subtitle={t("statistic-feature.statistics-desc")}
            start
          />
        </div>
        <div className="flex items-start justify-between mt-6 space-x-4 mb-4">
          <div className="flex space-x-8">
            <div ref={popupSearchRef} className="relative">
              <input
                type="text"
                value={keyword}
                onChange={handleChangeInputSearch}
                className="w-[300px] cursor-default rounded-md bg-white py-[4px] px-[12px] text-left text-gray-900 border-[#cdcdcd] border-[1px]"
                placeholder={t("property-feature.search-place-id")}
              />
              <button
                onClick={() => setIsShowPopup(true)}
                className="text-white absolute end-0 bg-rose-500 hover:bg-rose-600 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 top-0 bottom-0"
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

              {isShowPopup && (
                <div
                  ref={tablePopupDataRef}
                  className="absolute !top-[100%] z-10 mt-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <PopupTable
                    places={places}
                    paging={paging}
                    className={`absolute left-0 top-[100%] z-50 w-[1200px] review-horizontal overflow-auto max-h-[60vh]`}
                    ref={tablePopupDataRef}
                    handleSelectPlace={(place: string) =>
                      setSelectedRoom(place)
                    }
                  />
                </div>
              )}
            </div>
            <input
              type="date"
              value={filterFromDate}
              onChange={handleFromDateChange}
              className="w-[180px] cursor-default rounded-md bg-white py-[4px] px-[12px] text-left text-gray-900 border-[#cdcdcd] border-[1px]"
            />
            <Listbox
              value={filterOptions.map(
                (status) => status.value === filterDataSource
              )}
              onChange={handleDataSourceChange}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <ListboxButton className="relative w-[280px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {filterOptions.map(
                            (item) =>
                              item.value === filterDataSource && item.label
                          )}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <ListboxOptions className="absolute !top-[100%] z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filterOptions.map((item) => (
                          <ListboxOption
                            key={item.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-rose-100" : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={item}
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
                                    {item.label}
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
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          <div className="w-fit flex justify-between items-center space-x-8">
            <div className="w-[150px]">
              <Button
                outline={true}
                disabled={isLoading}
                label={t("general.clear-all")}
                onClick={handleClearAllFilters}
              />
            </div>
            <div className="w-[150px]">
              <Button
                disabled={isLoading}
                label={t("general.filter")}
                onClick={handleFilter}
              />
            </div>
          </div>
        </div>
        <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
          {cardData.map((d, i) => (
            <Card
              key={i}
              amount={d.amount}
              discription={d.discription}
              icon={d.icon}
              label={d.label}
            />
          ))}
        </section>
        <div className="flex items-start justify-between space-x-12 mt-6">
          <div className="mt-5 w-[50%]">
            <Heading title={t("statistic-feature.booking-cancelation-chart")} />
            <Bar options={options as any} data={filteredBarData as any} />
          </div>
          <div className="mt-5 w-[50%]">
            <Heading title={t("statistic-feature.revenue-chart")} />
            <Line options={options as any} data={filteredLineData as any} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default StatisticsVendorClient;
