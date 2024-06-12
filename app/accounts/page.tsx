import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import AccountClient from "./AccountClient";
import getUserById from "@/app/actions/getUserById";
import getAccounts from "@/app/actions/getAccounts";
import PaginationComponent from "@/components/PaginationComponent";
import { SHRINK_LIMIT } from "@/const";
import { AccountAPI, Pagination } from "@/models/api";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

interface AccountPageProps {
  searchParams?: Pagination;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Quản lý Tài khoản" : "Accounts Management",
  };
}

const AccountPage = async ({ searchParams }: AccountPageProps) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  if (!accessToken || !userId || !user || user?.role !== Role.Admin)
    unauthorized = true;

  let obj: AccountAPI | undefined = {
    accounts: [],
    paging: {
      total: 0,
      limit: SHRINK_LIMIT,
      page: 1,
    },
  };
  if (unauthorized) {
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );
  } else {
    obj = await getAccounts(searchParams || { page: 1, limit: SHRINK_LIMIT });
  }

  return (
    <ClientOnly>
      <AccountClient accounts={obj?.accounts} />
      {obj &&
        Number(obj.paging?.total ?? 0) >
          (Number(obj.paging?.limit) || SHRINK_LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={obj.paging?.total || SHRINK_LIMIT}
            limit={obj.paging?.limit || SHRINK_LIMIT}
          />
        )}
    </ClientOnly>
  );
};

export default AccountPage;
