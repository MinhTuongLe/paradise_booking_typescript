/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import React, { Fragment, useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import { isEmpty } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaEye } from "react-icons/fa";
import qs from "query-string";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import {
  account_report_types,
  classNames,
  emptyAvatar,
  place_report_types,
  post_guide_report_types,
  post_review_comment_report_types,
  report_status,
  report_statuses,
} from "@/const";
import EmptyState from "@/components/EmptyState";
import { User } from "@/models/user";
import { RootState } from "@/store/store";
import { Role, RequestGuiderType, ReportStatus } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { FcApprove, FcDisapprove } from "react-icons/fc";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Report } from "@/models/report";
import Image from "next/image";

function ReportClientPage({ reports }: { reports: Report[] }) {
  console.log("reports: ", reports);
  const { t } = useTranslation("translation", { i18n });

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("report-feature.type"), uid: "type" },
    { name: t("general.description"), uid: "description" },
    { name: t("general.user"), uid: "user" },
    { name: t("general.status"), uid: "status_name" },
    { name: t("request-feature.action"), uid: "" },
  ];
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const initStatus = params?.get("status_id")
    ? report_status.filter(
        (item) => item.value === Number(params.get("status_id"))
      )[0]
    : report_status[0];

  const initObjectType = params?.get("object_type")
    ? [
        ...place_report_types,
        ...post_guide_report_types,
        ...account_report_types,
        ...post_review_comment_report_types,
      ].filter((item) => item.name === params.get("object_type"))[0]?.name
    : "";

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<any>(initStatus);
  const [searchValue, setSearchValue] = useState("");
  const [objectType, setObjectType] = useState<string>(initObjectType ?? "");

  const handleSearch = () => {
    let updatedQuery = {};
    let currentQuery;

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      status_id: status?.value ?? "",
      object_type: objectType ?? "",
      user_id: searchValue,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName || "/reports",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  // handle report
  const handleGuiderReport = (
    type: RequestGuiderType,
    request_guider_id: number
  ) => {
    // setIsLoading(true);
    // if (!loggedUser || !request_guider_id) return;
    // const accessToken = Cookie.get("accessToken");
    // const config = {
    //   headers: {
    //     "content-type": "application/json",
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    //   params: {
    //     request_guider_id,
    //     type,
    //   },
    // };
    // axios
    //   .post(getApiRoute(RouteKey.ConfirmRequestGuider), null, config)
    //   .then(() => {
    //     toast.success(
    //       type === RequestGuiderType.Accept
    //         ? t("toast.accepted-guider-request")
    //         : t("toast.rejected-guider-request")
    //     );
    //     router.refresh();
    //   })
    //   .catch((err) => {
    //     console.log("err: ", err);
    //     // toast.error("Something Went Wrong");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const handleClearAllFilters = () => {
    setStatus(report_status[0]);
    setObjectType("");
    setSearchValue("");
    const url = qs.stringifyUrl({
      url: pathName || "/reports",
      query: {},
    });

    router.push(url);
  };

  const renderCell = useCallback(
    (report: Report, columnKey: string | number | string[] | User) => {
      const cellValue = report[columnKey as keyof Report];

      switch (columnKey) {
        case "user":
          return (
            <div className="flex justify-start items-center space-x-4 max-w-[300px] text-ellipsis line-clamp-1">
              <Image
                width={40}
                height={40}
                src={(cellValue as User)?.avt || emptyAvatar}
                alt="Avatar"
                className="rounded-full h-[40px] w-[40px] aspect-square"
                priority
              />
              <div>
                <h1 className="text-md font-bold space-y-3">
                  {(cellValue as User)?.full_name || "-"}
                </h1>
                <p>{(cellValue as User).email}</p>
              </div>
            </div>
          );
        case "status_name":
          const matchedReportStatus = report_statuses.find(
            (item) => item.name === cellValue
          );

          const name = matchedReportStatus ? matchedReportStatus.name : null;
          return (
            <span
              className={`py-1 px-4 rounded-2xl text-center text-sm`}
              style={{
                backgroundColor: matchedReportStatus?.background,
                color: matchedReportStatus?.color,
                border: `1px solid ${matchedReportStatus?.color}`,
              }}
            >
              {t(`report-feature.${name}`)}
            </span>
          );
        case "":
          return (
            <ul
              className="text-sm text-gray-700 dark:text-gray-200 flex space-x-4"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li>
                <div
                  className={`px-4 py-2 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                  style={{
                    backgroundColor: "#fff4ea",
                    color: "#ffa700",
                    border: `1px solid #ffa700`,
                  }}
                  onClick={() => router.push(`/reports/${report.id}`)}
                >
                  <FaEye className="text-xl cursor-pointer hover:text-rose-500" />
                </div>
              </li>
              {(report as Report).status_id !== ReportStatus.Complete ? (
                <li>
                  <div
                    className={`px-4 py-2 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                    style={{
                      backgroundColor: "#fff4ea",
                      color: "#ffa700",
                      border: `1px solid #ffa700`,
                    }}
                    onClick={() =>
                      handleGuiderReport(RequestGuiderType.Accept, report.id)
                    }
                  >
                    <FcApprove className="text-xl cursor-pointer hover:text-rose-500" />
                  </div>
                </li>
              ) : (
                <li>
                  <div
                    className={`px-4 py-2 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                    style={{
                      backgroundColor: "#fff4ea",
                      color: "#ffa700",
                      border: `1px solid #ffa700`,
                    }}
                    onClick={() =>
                      handleGuiderReport(RequestGuiderType.Reject, report.id)
                    }
                  >
                    <FcDisapprove className="text-xl cursor-pointer hover:text-rose-500" />
                  </div>
                </li>
              )}
            </ul>
          );
        case "type":
          return (
            <span className="w-[200px] text-ellipsis line-clamp-2">
              {cellValue ? t(`report-types.${cellValue}`) : "-"}
            </span>
          );
        case "description":
          return (
            <span className="min-w-[150px] max-w-[200px] text-ellipsis line-clamp-2">
              {(cellValue as string) || "-"}
            </span>
          );
        default:
          return cellValue || "-";
      }
    },
    []
  );

  if (loggedUser?.role !== Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="w-[100%] mx-auto px-4 mt-6">
      {!isLoading ? (
        <>
          <div className="mt-6 flex justify-between items-center w-full px-4">
            <div className="flex items-center w-[80%] space-x-8">
              <div className="relative w-[20%]">
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                  placeholder={t("request-feature.search-account-id")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  onClick={handleSearch}
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
              <Listbox
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="relative w-[180px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          {status?.icon && (
                            <>
                              {React.createElement(status.icon, {
                                size: 24,
                                className: `text-${status.color}`,
                                color: status.color,
                              })}
                            </>
                          )}
                          <span className="ml-3 block truncate">
                            {t(`report-feature.${status.label}`)}
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
                          {report_status
                            .filter((item) => item.value !== status.value)
                            .map((person) => (
                              <Listbox.Option
                                key={person.value}
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
                                        {t(`report-feature.${person.label}`)}
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
              <Listbox
                value={objectType}
                onChange={(e) => {
                  setObjectType(e);
                }}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="relative w-[300px] cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                        <span className="ml-3 block truncate">
                          {t(`report-types.${objectType}`)}
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
                          {[
                            ...post_review_comment_report_types,
                            {
                              name: "",
                              value: 0,
                            },
                          ]
                            .filter((item: any) => item.name !== objectType)
                            .map((person) => (
                              <Listbox.Option
                                key={person.value}
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
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {t(`report-types.${person.name}`)}
                                    </span>

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
            <div className="w-[20%] flex justify-between items-center space-x-8">
              <Button
                label={t("general.filter")}
                onClick={handleSearch}
                medium
              />
              <Button
                outline={true}
                disabled={isLoading}
                label={t("general.clear-all")}
                onClick={handleClearAllFilters}
                medium
              />
            </div>
          </div>

          <Table
            isStriped
            aria-label="Account Table"
            className="vendor-room-listing custom-admin-table"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  className="text-left bg-rose-500 text-white px-3 py-6 font-bold text-lg"
                  key={column.uid}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="mt-8 font-bold text-2xl text-rose-500">
                  {t("general.no-data-to-display")}
                </div>
              }
            >
              {reports?.map((report: Report, index: number) => (
                <TableRow
                  key={report.id}
                  className={`${index % 2 !== 0 ? "bg-white" : "bg-slate-100"}`}
                >
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(report, columnKey) as any}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default ReportClientPage;
