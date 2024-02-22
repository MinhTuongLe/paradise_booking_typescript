import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import AccountClient from "./AccountClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getAccounts from "@/app/actions/getAccounts";
import PaginationComponent from "@/components/PaginationComponent";
import { SHRINK_LIMIT } from "@/const";
import { AccountAPI } from "@/models/api";

export const dynamic = "force-dynamic";

interface AccountPageProps {
  searchParams?: any
}

const AccountPage = async ({ searchParams }: AccountPageProps) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;

  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!accessToken || !userId || !user || user?.role !== 3) unauthorized = true;

  let obj: AccountAPI | undefined = {
    accounts: [],
    paging: {
      total: 0,
      limit: SHRINK_LIMIT,
      page: 1,
    },
  };
  if (unauthorized) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  } else {
    obj = await getAccounts(searchParams || { page: 1, limit: SHRINK_LIMIT });
  }

  return (
    <ClientOnly>
      <AccountClient accounts={obj?.accounts} />
      {obj?.paging?.total && obj.paging?.total > (obj.paging?.limit || SHRINK_LIMIT) && (
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
