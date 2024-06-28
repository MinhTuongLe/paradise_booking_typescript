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
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { CreditCard, DollarSign, Users } from "lucide-react";
import qs from "query-string";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import Card, { CardProps } from "@/components/statistics/Card";
import { classNames, minSearchTextLength } from "@/const";
import { debounce } from "lodash";
import PopupTable from "@/components/statistics/PopupTable";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
    title: {
      display: true,
      text: "Grouped Grouped Bar Chart",
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

const cardData: CardProps[] = [
  {
    label: "Total Revenue",
    amount: "$45,231.89",
    discription: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    label: "Subscriptions",
    amount: "+2350",
    discription: "+180.1% from last month",
    icon: Users,
  },
  {
    label: "Sales",
    amount: "+12,234",
    discription: "+19% from last month",
    icon: CreditCard,
  },
];

const roomOptions = [
  { id: 1, name: "Room A", capacity: 10, address: "Address 1" },
  { id: 2, name: "Room B", capacity: 8, address: "Address 2" },
  { id: 3, name: "Room C", capacity: 12, address: "Address 3" },
  // Add more rooms as needed
];

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

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDataSource, setFilterDataSource] = useState("daily");
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
        url: pathName || "/properties",
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

  const handleToDateChange = useCallback((event: any) => {
    setFilterToDate(event.target.value);
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

  if (!authState || loggedUser?.role !== Role.Vendor) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  const filteredBarData = {
    labels,
    datasets: [
      {
        label: "Dataset 1 (Bar)",
        data: labels.map((value, index) => (index + 1) * 1000),
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Màu của cột thứ hai
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: "Dataset 2 (Bar)",
        data: labels.map((value, index) => (index + 1) * 800), // Giá trị của cột thứ hai
        backgroundColor: "rgba(244, 63, 94, 0.5)", // Màu của cột đầu
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
        label: "Dataset 2 (Line)",
        data: labels.map((value, index) => (index + 1) * 500),
        borderColor: "rgba(53, 162, 235, 0.5)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
      },
    ],
  };

  const filterOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  return (
    <div className="w-[100%] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      <Container>
        <div className="mt-10">
          <Heading
            title="Statistics"
            subtitle="The chart shows statistics from the website"
            start
          />
        </div>
        <div className="flex items-start mt-6 space-x-4 mb-4">
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
                  handleSelectPlace={(place: string) => setSelectedRoom(place)}
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
          <input
            type="date"
            value={filterToDate}
            onChange={handleToDateChange}
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
                  <Listbox.Button className="relative w-[180px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
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
                  </Listbox.Button>

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
                                    selected ? "font-semibold" : "font-normal",
                                    "ml-3 block truncate"
                                  )}
                                >
                                  {item.label}
                                </span>
                              </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-gray-900" : "text-rose-500",
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
        <div className="flex items-start justify-between space-x-12">
          <div className="mt-5 w-[50%]">
            <Heading title="Bar Chart" />
            <Bar options={options as any} data={filteredBarData as any} />
          </div>
          <div className="mt-5 w-[50%]">
            <Heading title="Line Chart" />
            <Line options={options as any} data={filteredLineData as any} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default StatisticsVendorClient;
