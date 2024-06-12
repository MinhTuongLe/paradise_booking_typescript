/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "@nextui-org/react";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { API_URL, place_report_types, emptyAvatar } from "@/const";
import EmptyState from "@/components/EmptyState";
import { User } from "@/models/user";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { Report } from "@/models/report";

const columns = [
  // { name: "Id", uid: "id" },
  { name: "User", uid: "user" },
  // { name: "Fullname", uid: "full_name" },
  { name: "Place", uid: "place" },
  { name: "Report Type", uid: "type" },
  { name: "Description", uid: "description" },
  // { name: "Phone", uid: "phone" },
  // { name: "Dob", uid: "dob" },
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

function ReportClient({ reports }: { reports: Report[] }) {
  console.log("reports: ", reports);
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const [reportData, setReportData] = useState([]);

  const handleStatusChange = (event: any, accountId: number) => {
    const newStatus = event.target.value;

    const accessToken = Cookie.get("accessToken");
    const config = {
      params: {
        id: accountId,
        status: Number(newStatus),
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(`${API_URL}/change/status`, null, config)
      .then(() => {
        setIsLoading(false);
        toast.success("Update Account Status Successfully");
      })
      .catch((err) => {
        toast.error("Update Account Status Failed");
        setIsLoading(false);
      });
  };

  // console.log(reportData);

  useEffect(() => {
    const currentReportData = localStorage.getItem("reportData");
    if (currentReportData) {
      setReportData(JSON.parse(currentReportData));
    }
  }, []);

  const renderCell = useCallback((user: any, columnKey: number | string) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      // case "full_name":
      //   return (
      //     <div className="flex justify-start items-center space-x-4">
      //       <Image
      //         width={40}
      //         height={40}
      //         src={user?.avatar || emptyAvatar}
      //         alt="Avatar"
      //         className="rounded-full h-[40px] w-[40px]"
      //         priority
      //       />
      //       <div>
      //         <h1 className="text-md font-bold space-y-3">
      //           {cellValue || "-"}
      //         </h1>
      //         <p>{user.email}</p>
      //       </div>
      //     </div>
      //   );
      // case "type":
      //   const matchedPaymentStatus = place_report_types.find(
      //     (item) => item.value === cellValue
      //   );

      //   const name = matchedPaymentStatus ? matchedPaymentStatus.name : "-";
      //   return <span className="">{name}</span>;
      default:
        return cellValue || "-";
    }
  }, []);

  if (loggedUser?.role !== Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {!isLoading && (
        <Table aria-label="Account Table">
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
                {/* {t("general.no-data-to-display")} */}
              </div>
            }
          >
            {reportData?.map((account: User) => (
              <TableRow key={account.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(account, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ReportClient;
