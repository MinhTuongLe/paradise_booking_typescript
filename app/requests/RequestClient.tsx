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
import { useRouter } from "next/navigation";
import { FaCheck, FaEye } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { API_URL, emptyAvatar } from "@/const";
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

const columns = [
  { name: "Id", uid: "id" },
  { name: "Username", uid: "username" },
  { name: "Fullname", uid: "full_name" },
  // { name: "Address", uid: "address" },
  // { name: "Phone", uid: "phone" },
  // { name: "Dob", uid: "dob" },
  { name: "Reason", uid: "reason" },
  { name: "Goals of travel", uid: "goals_of_travel" },
  { name: "Languages", uid: "languages" },
  // { name: "Description", uid: "description" },
  { name: "Action", uid: "" },
];

function RequestClient({ requests }: { requests: Guider[] }) {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

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
            ? "Accepted guider request!"
            : "Rejected guider request!"
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
                  onClick={() => router.push(`/requests/${request.user_id}`)}
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
        <Table aria-label="Account Table" className="vendor-room-listing">
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
                  <TableCell>{renderCell(request, columnKey) as any}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default RequestClient;
