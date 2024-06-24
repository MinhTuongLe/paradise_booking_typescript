import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PaymentGuiderClient from "./PaymentGuiderClient";
import getUserById from "@/app/actions/getUserById";
import getPaymentByGuiderId from "@/app/actions/getPaymentByGuiderId";
import PaginationComponent from "@/components/PaginationComponent";
import { SHRINK_LIMIT } from "@/const";
import { Pagination, PaymentAPI } from "@/models/api";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Quản lý Thanh toán" : "Payment Management",
  };
}

const PaymentGuiderPage = async ({
  searchParams,
}: {
  searchParams: Pagination;
}) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;

  const guider_id = cookies().get("userId")?.value;
  const user = await getUserById(guider_id);
  if (!accessToken || !guider_id || !user || user?.role !== Role.Guider)
    unauthorized = true;

  let obj: PaymentAPI | undefined = {
    payments: [],
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
    obj = await getPaymentByGuiderId(
      { guider_id, ...searchParams } || {
        guider_id,
        page: 1,
        limit: SHRINK_LIMIT,
      }
    );
  }

  return (
    <ClientOnly>
      <PaymentGuiderClient payments={obj?.payments} />
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

export default PaymentGuiderPage;
