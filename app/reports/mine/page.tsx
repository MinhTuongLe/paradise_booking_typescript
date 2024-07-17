import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyReportClientPage from "./MyReportClientPage";
import getUserById from "@/app/actions/getUserById";
import PaginationComponent from "@/components/PaginationComponent";
import { SHRINK_LIMIT } from "@/const";
import { Pagination } from "@/models/api";
import { Report } from "@/models/report";
import getReports from "@/app/actions/getReports";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Quản lý Báo cáo" : "Report Management",
  };
}

const MyReportPage = async ({ searchParams }: { searchParams: any }) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  if (!accessToken || !userId || !user) unauthorized = true;

  let obj: { reports: Report[]; paging: Pagination } | undefined = {
    reports: [],
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
    obj = await getReports(
      { ...searchParams, user_id: userId } || {
        page: 1,
        limit: SHRINK_LIMIT,
        user_id: userId,
      }
    );
  }

  return (
    <ClientOnly>
      <MyReportClientPage reports={obj?.reports} />
      {obj &&
        Number(obj.paging?.total! ?? 0) >
          (Number(obj.paging?.limit! ?? 0) || SHRINK_LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={obj.paging?.total || SHRINK_LIMIT}
            limit={obj.paging?.limit || SHRINK_LIMIT}
          />
        )}
    </ClientOnly>
  );
};

export default MyReportPage;
