import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import RequestClient from "./RequestClient";
import getUserById from "@/app/actions/getUserById";
import PaginationComponent from "@/components/PaginationComponent";
import { SHRINK_LIMIT } from "@/const";
import { Pagination } from "@/models/api";
import { Role } from "@/enum";
import { Guider } from "@/models/user";
import getGuiderRequests from "../actions/getGuiderRequests";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Quản lý Yêu cầu" : "Request Management",
  };
}

const RequestPage = async ({ searchParams }: { searchParams: any }) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  if (!accessToken || !userId || !user || user?.role !== Role.Admin)
    unauthorized = true;

  let obj: { requests: Guider[]; paging: Pagination } | undefined = {
    requests: [],
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
    obj = await getGuiderRequests(searchParams || { page: 1, limit: SHRINK_LIMIT });
  }

  return (
    <ClientOnly>
      <RequestClient requests={obj?.requests} />
      {obj && obj.paging?.total && obj.paging?.total > (obj.paging?.limit || SHRINK_LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj.paging?.total || SHRINK_LIMIT}
          limit={obj.paging?.limit || SHRINK_LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export default RequestPage;
