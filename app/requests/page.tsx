import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import RequestClient from "./RequestClient";
import getUserById from "@/app/actions/getUserById";
import getAccounts from "@/app/actions/getAccounts";
import PaginationComponent from "@/components/PaginationComponent";
import { LIMIT } from "@/const";
import { AccountAPI } from "@/models/api";
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Request Management",
  };
}

const RequestPage = async ({ searchParams }: { searchParams: any }) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;

  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!accessToken || !userId || !user || user?.role !== getRoleId(Role.Admin)) unauthorized = true;

  let obj: AccountAPI | undefined = {
    accounts: [],
    paging: {
      total: 0,
      limit: LIMIT,
      page: 1,
    },
  };
  if (unauthorized) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  } else {
    obj = await getAccounts(searchParams || { page: 1, limit: LIMIT });
  }

  return (
    <ClientOnly>
      <RequestClient accounts={obj?.accounts} />
      {obj && obj.paging?.total > (obj.paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj.paging?.total || LIMIT}
          limit={obj.paging?.limit || LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export default RequestPage;
