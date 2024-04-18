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

import i18n from "@/i18n/i18n";
import "../../styles/globals.css";
import { API_URL, account_status, roles } from "@/const";
import EmptyState from "@/components/EmptyState";
import { emptyAvatar } from "../../const.ts";
import { User } from "@/models/user";
import { RootState } from "@/store/store.ts";
import { getRoleId } from "@/utils/getUserInfo.ts";
import { Role } from "@/enum.ts";

interface AccountClientProps {
  accounts: User[];
}

const AccountClient: React.FC<AccountClientProps> = ({ accounts }) => {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { name: t("general.id"), uid: "id" },
    { name: t("general.username"), uid: "username" },
    { name: t("general.fullname"), uid: "full_name" },
    { name: t("general.role"), uid: "role" },
    { name: t("general.status"), uid: "status" },
    { name: t("general.address"), uid: "address" },
    { name: t("general.phone"), uid: "phone" },
    { name: t("general.dob"), uid: "dob" },
  ];

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    accountId: number
  ) => {
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
        toast.success(t("toast.update-account-status-successfully"));
      })
      .catch((err) => {
        toast.error(t("toast.update-account-status-failed"));
        setIsLoading(false);
      });
  };

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    accountId: number
  ) => {
    const newRole = event.target.value;

    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .patch(
        `${API_URL}/account/role/${accountId}`,
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

  const renderCell = useCallback((user: User, columnKey: string) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "username":
        return (
          <span className="max-w-[150px] text-ellipsis line-clamp-1">
            {cellValue || "-"}
          </span>
        );
      case "full_name":
        return (
          <div className="flex justify-start items-center space-x-4 max-w-[300px] text-ellipsis line-clamp-1">
            <Image
              width={40}
              height={40}
              src={user?.avatar || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] aspect-square"
              priority
            />
            <div>
              <h1 className="text-md font-bold space-y-3">
                {cellValue || "-"}
              </h1>
              <p>{user.email}</p>
            </div>
          </div>
        );
      case "role":
        const defaultValue = roles.find((item) => item.name === cellValue);
        return (
          <select
            onChange={(event) => handleRoleChange(event, user.id)}
            defaultValue={defaultValue?.id}
            id="status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[full] p-2.5 "
          >
            {roles.map((role) => (
              <option value={role.id} key={role.id}>
                {t(`roles.${role.name}`)}
              </option>
            ))}
          </select>
        );
      case "status":
        const defaultAccountStatus = account_status.find(
          (item) => item.name === cellValue
        );
        return (
          <select
            onChange={(event) => handleStatusChange(event, user.id)}
            defaultValue={defaultAccountStatus?.id}
            id="status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[full] p-2.5 "
          >
            {account_status.map((status) => (
              <option value={status.id} key={status.id}>
                {t(`account-status.${status.name}`)}
              </option>
            ))}
          </select>
        );
      case "address":
        return (
          <span className="max-w-[200px] text-ellipsis line-clamp-1">
            {cellValue || "-"}
          </span>
        );
      case "phone":
        return (
          <span className="max-w-[150px] text-ellipsis line-clamp-1">
            {cellValue || "-"}
          </span>
        );
      case "dob":
        return (
          <span className="max-w-[100px] text-ellipsis line-clamp-1">
            {cellValue || "-"}
          </span>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  if (loggedUser?.role !== getRoleId(Role.Admin)) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="w-[100%] mx-auto px-4">
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
              <div className="mt-4">{t("general.no-data-to-display")}</div>
            }
          >
            {accounts?.map((account: User) => (
              <TableRow key={account.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(account, columnKey as string)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AccountClient;
