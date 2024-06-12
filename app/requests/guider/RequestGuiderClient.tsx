/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CgProfile } from "react-icons/cg";
import { MdLanguage, MdModeOfTravel } from "react-icons/md";
import { isEmpty } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaEye } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import qs from "query-string";

import i18n from "@/i18n/i18n";
import "../../../styles/globals.css";
import {
  API_URL,
  become_guider_status,
  classNames,
  emptyAvatar,
} from "@/const";
import EmptyState from "@/components/EmptyState";
import { Guider, User } from "@/models/user";
import { RootState } from "@/store/store";
import { getAccountActive } from "@/utils/getAccountActive";
import {
  Role,
  AccountActive,
  BecomeGuiderStatus,
  RequestGuiderType,
} from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { FcApprove, FcDisapprove } from "react-icons/fc";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

function RequestGuiderClient({ requests }: { requests: Guider[] }) {
  const { t } = useTranslation("translation", { i18n });

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("general.username"), uid: "username" },
    { name: t("general.fullname"), uid: "full_name" },
    // { name: "Address", uid: "address" },
    // { name: "Phone", uid: "phone" },
    // { name: "Dob", uid: "dob" },
    { name: t("request-feature.reason"), uid: "reason" },
    { name: t("request-feature.goals-of-travel"), uid: "goals_of_travel" },
    { name: t("request-feature.languages"), uid: "languages" },
    // { name: "Description", uid: "description" },
    { name: t("request-feature.action"), uid: "" },
  ];
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<any>(become_guider_status[0]);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  useEffect(() => {
    if (status?.value !== null) {
      let updatedQuery = {};
      let currentQuery;

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      updatedQuery = {
        ...currentQuery,
        status: status?.value,
      };

      const url = qs.stringifyUrl(
        {
          url: pathName || "/post-guiders",
          query: updatedQuery,
        },
        { skipNull: true }
      );

      router.push(url);
    }
  }, [location, router, status]);

  // handle guider request
  const handleGuiderRequest = (
    type: RequestGuiderType,
    request_guider_id: number
  ) => {
    setIsLoading(true);
    if (!loggedUser || !request_guider_id) return;

    const accessToken = Cookie.get("accessToken");

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        request_guider_id,
        type,
      },
    };

    axios
      .post(getApiRoute(RouteKey.ConfirmRequestGuider), null, config)
      .then(() => {
        toast.success(
          type === RequestGuiderType.Accept
            ? t("toast.accepted-guider-request")
            : t("toast.rejected-guider-request")
        );
        router.refresh();
      })
      .catch((err) => {
        console.log("err: ", err);
        // toast.error("Something Went Wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearAllFilters = () => {
    setStatus(null);
    const url = qs.stringifyUrl({
      url: pathName || `/requests/vendor`,
      query: {},
    });

    router.push(url);
  };

  const renderCell = useCallback(
    (request: Guider, columnKey: string | number | string[] | User) => {
      const cellValue = request[columnKey as keyof Guider];

      switch (columnKey) {
        case "username":
          return (
            <span className="w-[150px] text-ellipsis line-clamp-1">
              {(cellValue as string) || "-"}
            </span>
          );
        case "full_name":
          return (
            <div className="flex justify-start items-center space-x-4 min-w-[150px] max-w-[300px] text-ellipsis line-clamp-1">
              <div>
                <h1 className="text-md font-bold space-y-3">
                  {(cellValue as string) || "-"}
                </h1>
                <p>{request.email}</p>
              </div>
            </div>
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
                  onClick={() =>
                    router.push(`/requests/guider/${request.user_id}`)
                  }
                >
                  <FaEye className="text-xl cursor-pointer hover:text-rose-500" />
                </div>
              </li>
              {request.status !== BecomeGuiderStatus.Success ? (
                <li>
                  <div
                    className={`px-4 py-2 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                    style={{
                      backgroundColor: "#fff4ea",
                      color: "#ffa700",
                      border: `1px solid #ffa700`,
                    }}
                    onClick={() =>
                      handleGuiderRequest(RequestGuiderType.Accept, request.id)
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
                      handleGuiderRequest(RequestGuiderType.Reject, request.id)
                    }
                  >
                    <FcDisapprove className="text-xl cursor-pointer hover:text-rose-500" />
                  </div>
                </li>
              )}
            </ul>
          );
        case "address":
          return (
            <span className="w-[200px] text-ellipsis line-clamp-2">
              {(cellValue as string) || "-"}
            </span>
          );
        case "phone":
          return (
            <span className="w-[150px] text-ellipsis line-clamp-1">
              {(cellValue as string) || "-"}
            </span>
          );
        case "goals_of_travel":
          return (
            <div className="space-y-2">
              {cellValue &&
                !isEmpty(cellValue) &&
                (cellValue as string[]).map((item, index) => (
                  <div
                    key={index}
                    className="min-w-[250px] max-w-[400px] text-ellipsis line-clamp-5 flex items-center"
                  >
                    <FaCheck className="text-ld mr-2" />
                    {item || "-"}
                  </div>
                ))}
            </div>
          );
        case "languages":
          return (
            <div className="space-y-2">
              {cellValue &&
                !isEmpty(cellValue) &&
                (cellValue as string[]).map((item, index) => (
                  <div
                    key={index}
                    className="min-w-[150px] max-w-[250px] text-ellipsis line-clamp-5 flex items-center"
                  >
                    <MdLanguage className="text-ld mr-2" />
                    {item || "-"}
                  </div>
                ))}
            </div>
          );
        case "description":
          return (
            <span className="min-w-[150px] max-w-[200px] text-ellipsis line-clamp-2">
              {(cellValue as string) || "-"}
            </span>
          );
        case "reason":
          return (
            <span className="min-w-[150px] max-w-[200px] text-ellipsis line-clamp-2">
              {(cellValue as string) || "-"}
            </span>
          );
        case "dob":
          return (
            <span className="w-[100px] text-ellipsis line-clamp-1">
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
          <div className="mt-10 flex justify-between items-center w-full px-4">
            <div className="flex items-center w-[80%] space-x-16">
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
                            {t(`request-feature.${status.label}`)}
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
                          {become_guider_status
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
                                        {t(`request-feature.${person.label}`)}
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
            <div className="w-[10%] flex justify-between items-center space-x-8">
              <Button
                outline={true}
                disabled={isLoading}
                label={t("general.clear-all")}
                onClick={handleClearAllFilters}
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
                <div className="mt-4">{t("general.no-data-to-display")}</div>
              }
            >
              {requests?.map((request: Guider, index: number) => (
                <TableRow
                  key={request.id}
                  className={`${index % 2 !== 0 ? "bg-white" : "bg-slate-100"}`}
                >
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(request, columnKey) as any}
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

export default RequestGuiderClient;
