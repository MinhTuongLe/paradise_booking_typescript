/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import { useCallback, useState } from "react";
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
import { CgProfile } from "react-icons/cg";
import { MdLanguage, MdModeOfTravel } from "react-icons/md";
import { isEmpty } from "lodash";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { API_URL, emptyAvatar } from "@/const";
import EmptyState from "@/components/EmptyState";
import { Guider } from "@/models/user";
import { RootState } from "@/store/store";
import { getAccountActive } from "@/utils/getAccountActive";
import { Role, AccountActive, BecomeGuiderStatus } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { FaCheck } from "react-icons/fa";

const columns = [
  { name: "Id", uid: "id" },
  { name: "Username", uid: "username" },
  { name: "Fullname", uid: "full_name" },
  { name: "Address", uid: "address" },
  { name: "Phone", uid: "phone" },
  { name: "Dob", uid: "dob" },
  { name: "Reason", uid: "reason" },
  { name: "Goals of travel", uid: "goals_of_travel" },
  { name: "Languages", uid: "languages" },
  { name: "Description", uid: "description" },
  { name: "Action", uid: "status" },
];

function RequestClient({ requests }: { requests: Guider[] }) {
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const handleRequest = (accountId: number, newRole: Role) => {
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .patch(
        getApiRoute(RouteKey.AccountRole, { accountId }),
        {
          role: Number(newRole),
        },
        config
      )
      .then(() => {
        setIsLoading(false);
        toast.success(t("toast.update-account-role-successfully"));
      })
      .catch((err) => {
        toast.error(t("toast.update-account-role-failed"));
        setIsLoading(false);
      });
  };

  const renderCell = useCallback(
    (user: Guider, columnKey: string | number | string[]) => {
      const cellValue = user[columnKey as keyof Guider];

      switch (columnKey) {
        case "username":
          return (
            <span className="w-[150px] text-ellipsis line-clamp-1">
              {cellValue || "-"}
            </span>
          );
        case "full_name":
          return (
            <div className="flex justify-start items-center space-x-4 min-w-[150px] max-w-[300px] text-ellipsis line-clamp-1">
              <div>
                <h1 className="text-md font-bold space-y-3">
                  {cellValue || "-"}
                </h1>
                <p>{user.email}</p>
              </div>
            </div>
          );
        case "status":
          return (
            <>
              {cellValue === BecomeGuiderStatus.Processing ? (
                <div
                  className={`py-1 px-4 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                  style={{
                    backgroundColor: "#e1ebf2",
                    color: "#1975d3",
                    border: `1px solid #1975d3`,
                  }}
                  onClick={() => handleRequest(user.id, Role.Guider)}
                >
                  {`Accept`}
                </div>
              ) : (
                <div
                className={`py-1 px-4 rounded-2xl text-center text-sm cursor-pointer hover:brightness-90`}
                style={{
                  backgroundColor: "#fff4ea",
                  color: "#ffa700",
                  border: `1px solid #ffa700`,
                }}
                onClick={() => handleRequest(user.id, Role.User)}
              >
                {`Redeem`}
              </div>
              )}
            </>
          );
        case "address":
          return (
            <span className="w-[200px] text-ellipsis line-clamp-1">
              {cellValue || "-"}
            </span>
          );
        case "phone":
          return (
            <span className="w-[150px] text-ellipsis line-clamp-1">
              {cellValue || "-"}
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
              {cellValue || "-"}
            </span>
          );
        case "reason":
          return (
            <span className="min-w-[150px] max-w-[200px] text-ellipsis line-clamp-2">
              {cellValue || "-"}
            </span>
          );
        case "dob":
          return (
            <span className="w-[100px] text-ellipsis line-clamp-1">
              {cellValue || "-"}
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
            emptyContent={<div className="mt-4">No data to display.</div>}
          >
            {requests?.map((request: Guider) => (
              <TableRow key={request.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(request, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default RequestClient;
