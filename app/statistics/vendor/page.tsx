import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsVendorClient from "./StatisticsVendorClient";
import getUserById from "@/app/actions/getUserById";
import { Role, StatisticFilterSelection } from "@/enum";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import getPlaces from "@/app/actions/getPlaces";
import { SHRINK_LIMIT, formatDateType } from "@/const";
import getStatisticsPlace from "@/app/actions/getStatisticsPlace";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Thống kê" : "Statistic",
  };
}
const StatisticsVendorPage = async ({
  searchParams,
}: {
  searchParams: Pagination & {
    date_from: string;
    date_to: string;
    type: StatisticFilterSelection;
  };
}) => {
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;
  const defaultDateFrom = dayjs().format(formatDateType.DMY2);
  const defaultDateTo = dayjs().add(7, "day").format(formatDateType.DMY2);

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

  const resultStatistics = await getStatisticsPlace(
    {
      ...searchParams,
      date_from: searchParams?.date_from || defaultDateFrom,
      date_to: searchParams?.date_to || defaultDateTo,
      type: searchParams?.type || StatisticFilterSelection.DATES,
    } || {
      date_from: defaultDateFrom,
      date_to: defaultDateTo,
      type: StatisticFilterSelection.DATES,
    }
  );

  const resultPlaces: { places: Place[]; paging: Pagination } = await getPlaces(
    {
      ...searchParams,
      limit: SHRINK_LIMIT,
      vendor_id: userId,
    } || {
      page: 1,
      limit: SHRINK_LIMIT,
      vendor_id: userId,
    }
  );

  const { places, paging } = resultPlaces;

  return (
    <ClientOnly>
      <StatisticsVendorClient
        places={places}
        paging={paging}
        data={resultStatistics}
      />
    </ClientOnly>
  );
};

export default StatisticsVendorPage;
