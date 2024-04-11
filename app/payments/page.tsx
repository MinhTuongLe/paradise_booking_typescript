import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PaymentClient from "./PaymentClient";
import getUserById from "@/app/actions/getUserById";
import getPaymentByVendorId from "@/app/actions/getPaymentByVendorId";
import PaginationComponent from "@/components/PaginationComponent";
import {  SHRINK_LIMIT } from "@/const";
import { Pagination, PaymentAPI } from "@/models/api";
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Payment Management",
  };
}

const PaymentPage = async ({ searchParams }: { searchParams: Pagination }) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;

  const vendor_id = cookies().get("userId")?.value;
  const user = await getUserById(vendor_id);
  if (!accessToken || !vendor_id || !user || user?.role !== getRoleId(Role.Vendor))
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
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  } else {
    obj = await getPaymentByVendorId(
      { vendor_id, ...searchParams } || {
        vendor_id,
        page: 1,
        limit: SHRINK_LIMIT,
      }
    );
  }

  return (
    <ClientOnly>
      <PaymentClient payments={obj?.payments} />
      {obj && obj.paging?.total > (obj.paging?.limit || SHRINK_LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj.paging?.total || SHRINK_LIMIT}
          limit={obj.paging?.limit || SHRINK_LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export default PaymentPage;
