import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ReportClient from "./ReportClient";
import getUserById from "@/app/actions/getUserById";
import getAccounts from "@/app/actions/getAccounts";
import PaginationComponent from "@/components/PaginationComponent";
import { LIMIT } from "@/const";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Report Management",
  };
}
const ReportPage = async () => {
  // let unauthorized = false;
  // const accessToken = cookies().get("accessToken")?.value;

  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  // if (!accessToken || !userId || !user || user?.role !== Role.Admin) unauthorized = true;

  // let obj = {
  //   accounts: [],
  //   paging: {
  //     total: 0,
  //     limit: LIMIT,
  //     page: 1,
  //   },
  // };
  if (user?.role !== Role.Admin) {
    return (
      <EmptyState
      // title={t("general.unauthorized")}
      // subtitle={t("general.please-login")}
      />
    );
  }
  // else {
  //   obj = await getAccounts(searchParams || { page: 1, limit: LIMIT });
  // }

  return (
    <ClientOnly>
      <ReportClient />
      {/* {obj.paging?.total > (obj.paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj.paging?.total || LIMIT}
          limit={obj.paging?.limit || LIMIT}
        />
      )} */}
    </ClientOnly>
  );
};

export default ReportPage;
