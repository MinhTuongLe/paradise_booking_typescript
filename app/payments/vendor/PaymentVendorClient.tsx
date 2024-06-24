/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import { useCallback, useState } from "react";
import qs from "query-string";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import axios from "axios";

import i18n from "@/i18n/i18n";
import "../../../styles/globals.css";
import { payment_methods, payment_statuses } from "@/const";
import EmptyState from "@/components/EmptyState";
import { Payment } from "@/models/payment";
import { RootState } from "@/store/store";
import { PaymentStatus, Role } from "@/enum";
import { getPriceFormated } from "@/utils/getPriceFormated";
import { MdOutlineCreditCardOff, MdOutlineCreditScore } from "react-icons/md";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

interface PaymentVendorClientProps {
  payments: Payment[];
}

const PaymentVendorClient: React.FC<PaymentVendorClientProps> = ({
  payments,
}) => {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const params = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const { t } = useTranslation("translation", { i18n });
  const accessToken = Cookies.get("accessToken");

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("general.booking-id"), uid: "booking_id" },
    { name: t("general.created"), uid: "created_at" },
    { name: t("general.amount"), uid: "amount" },
    { name: t("general.method"), uid: "method_id" },
    { name: t("general.status"), uid: "status_id" },
    { name: t("request-feature.action"), uid: "" },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (newStatus: PaymentStatus, paymentId: number) => {
    setIsLoading(true);
    const config = {
      params: {
        id: paymentId,
        status: Number(newStatus),
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .put(getApiRoute(RouteKey.Payments), null, config)
      .then(() => {
        toast.success(t("toast.update-payment-status-successfully"));
        router.refresh();
      })
      .catch((err) => {
        toast.error(t("toast.update-payment-status-failed"));
      })
      .finally(() => setIsLoading(false));
  };

  const handleFormSubmit = (isClear: boolean) => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const updatedQuery = {
      ...currentQuery,
      limit: 0,
      page: 0,
      booking_id: isClear ? null : searchValue,
    };

    if (isClear) setSearchValue("");

    const url = qs.stringifyUrl(
      {
        url: pathName || "/payments",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const renderCell = useCallback(
    (payment: Payment, columnKey: number | string) => {
      const cellValue = payment[columnKey as keyof Payment];

      switch (columnKey) {
        case "booking_id":
          return (
            <span
              onClick={() => router.push(`/reservations/${cellValue}`)}
              className="underline cursor-pointer hover:text-rose-500"
            >
              {cellValue || "-"}
            </span>
          );
        case "created_at":
          return (
            <div className="space-y-1 flex flex-col">
              <span>
                {cellValue
                  .toString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-") || "-"}
              </span>
              <span className="text-sm text-gray-600">
                {cellValue.toString().split("T")[1].slice(0, -1) || "-"}
              </span>
            </div>
          );
        case "status_id":
          const matchedPaymentStatus = payment_statuses.find(
            (item) => item.id === cellValue
          );

          const name = matchedPaymentStatus ? matchedPaymentStatus.name : null;
          return (
            <span
              className={`py-1 px-4 rounded-2xl text-center text-sm`}
              style={{
                backgroundColor: matchedPaymentStatus?.background,
                color: matchedPaymentStatus?.color,
                border: `1px solid ${matchedPaymentStatus?.color}`,
              }}
            >
              {t(`payment-status.${name}`)}
            </span>
          );
        case "method_id":
          const matchedPaymentMethod = payment_methods.find(
            (item) => item.id === cellValue
          );

          const Name = matchedPaymentMethod ? matchedPaymentMethod.name : null;
          return (
            <span
              className={`py-1 px-4 rounded-2xl text-center text-sm`}
              style={{
                backgroundColor: matchedPaymentMethod?.background,
                color: matchedPaymentMethod?.color,
                border: `1px solid ${matchedPaymentMethod?.color}`,
              }}
            >
              {Name}
            </span>
          );
        case "amount":
          return <span>{getPriceFormated(Number(cellValue)) || "-"} VND</span>;
        case "":
          return (
            <ul
              className="text-sm text-gray-700 dark:text-gray-200 flex space-x-4"
              aria-labelledby="dropdownMenuIconButton"
            >
              {payment.status_id === PaymentStatus.Unpaid ? (
                <li>
                  <div
                    className={`px-4 py-2 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                    style={{
                      backgroundColor: "#e1ebf2",
                      color: "#1975d3",
                      border: `1px solid #1975d3`,
                    }}
                    onClick={() =>
                      handleStatusChange(PaymentStatus.Paid, payment.id)
                    }
                  >
                    <MdOutlineCreditScore className="text-xl cursor-pointer hover:text-rose-500" />
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
                      handleStatusChange(PaymentStatus.Unpaid, payment.id)
                    }
                  >
                    <MdOutlineCreditCardOff className="text-xl cursor-pointer hover:text-rose-500" />
                  </div>
                </li>
              )}
            </ul>
          );
        default:
          return cellValue || "-";
      }
    },
    []
  );

  if (loggedUser?.role !== Role.Vendor) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="w-[100%] mx-auto px-4">
      <div className="w-full flex space-x-6 items-center justify-start">
        <div className="mt-10 w-[30%] px-4">
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
              placeholder={`${t("general.search")} ${t(
                "general.payment-id"
              )} ...`}
              value={searchValue}
              onChange={handleInputChange}
            />
            <button
              onClick={() => handleFormSubmit(false)}
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
        <button
          onClick={() => handleFormSubmit(true)}
          className="mt-10 text-rose-500 hover:brightness-75 focus:outline-none font-medium rounded-lg text-sm px-6 py-2 border-[1px] border-rose-500"
        >
          {t("general.clear")}
        </button>
      </div>

      <>
        {!isLoading ? (
          <Table aria-label="Payment Table">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  className="text-left bg-slate-200 px-3 py-3"
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
              {payments?.map((payment: Payment) => (
                <TableRow key={payment.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(payment, columnKey)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </>
    </div>
  );
};

export default PaymentVendorClient;
