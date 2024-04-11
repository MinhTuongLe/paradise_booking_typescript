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

import "../../styles/globals.css";
import { API_URL, account_status, roles } from "@/const";
import EmptyState from "@/components/EmptyState";
import { emptyAvatar } from "../../const.ts";
import { User } from "@/models/user";
import { RootState } from "@/store/store.ts";
import { getRoleId } from "@/utils/getUserInfo.ts";
import { Role } from "@/enum.ts";

const columns = [
  { name: "Id", uid: "id" },
  { name: "Username", uid: "username" },
  { name: "Fullname", uid: "full_name" },
  { name: "Role", uid: "role" },
  { name: "Status", uid: "status" },
  { name: "Address", uid: "address" },
  { name: "Phone", uid: "phone" },
  { name: "Dob", uid: "dob" },
];

interface AccountClientProps {
  accounts: User[];
}

const AccountClient: React.FC<AccountClientProps> = ({ accounts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

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
        toast.success("Update Account Status Successfully");
      })
      .catch((err) => {
        toast.error("Update Account Status Failed");
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
        toast.success("Update Account Role Successfully");
      })
      .catch((err) => {
        toast.error("Update Account Role Failed");
        setIsLoading(false);
      });
  };

  const renderCell = useCallback((user: User, columnKey: string) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "full_name":
        return (
          <div className="flex justify-start items-center space-x-4">
            <Image
              width={40}
              height={40}
              src={user?.avatar || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px]"
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
                {role.name}
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
                {status.name}
              </option>
            ))}
          </select>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  if (loggedUser?.role !== getRoleId(Role.Admin)) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
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
