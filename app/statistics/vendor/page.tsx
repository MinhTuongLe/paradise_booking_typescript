import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsVendorClient from "./StatisticsVendorClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import getPlaces from "@/app/actions/getPlaces";
import { SHRINK_LIMIT } from "@/const";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistic",
  };
}
const StatisticsVendorPage = async ({
  searchParams,
}: {
  searchParams: Pagination;
}) => {
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);
  if (!user || user.role !== Role.Vendor) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
        />
      </ClientOnly>
    );
  }

  const resultPlaces: { places: Place[]; paging: Pagination } = await getPlaces(
    {
      ...searchParams,
      limit: SHRINK_LIMIT,
    } || {
      page: 1,
      limit: SHRINK_LIMIT,
    }
  );
  const { places, paging } = resultPlaces;

  return (
    <ClientOnly>
      <StatisticsVendorClient places={places} paging={paging} />
    </ClientOnly>
  );
};

export default StatisticsVendorPage;
