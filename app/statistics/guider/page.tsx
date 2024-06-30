import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsGuiderClient from "./StatisticsGuiderClient";
import getUserById from "@/app/actions/getUserById";
import { Role, StatisticFilterSelection } from "@/enum";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import { SHRINK_LIMIT, formatDateType } from "@/const";
import getStatisticsPlace from "@/app/actions/getStatisticsPlace";
import dayjs from "dayjs";
import getPlacesPopup from "@/app/actions/getPlacesPopup";
import getPostGuidersByTopicId from "@/app/actions/getPostGuidersByTopicId";
import getStatisticsPostGuiders from "@/app/actions/getStatisticsPostGuiders";
import { PostGuider } from "@/models/post";
import getPostGuidersPopup from "@/app/actions/getPostGuidersPopup";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Thống kê" : "Statistic",
  };
}
const StatisticsGuiderPage = async ({
  searchParams,
}: {
  searchParams: Pagination & {
    date_from: string;
    date_to: string;
    type: StatisticFilterSelection;
    place_id: number | string;
  };
}) => {
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;
  const defaultDateFrom = dayjs().format(formatDateType.DMY2);
  const defaultDateTo = dayjs().add(7, "day").format(formatDateType.DMY2);

  const user = await getUserById(userId);
  if (!user || user.role !== Role.Guider) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
        />
      </ClientOnly>
    );
  }

  const resultStatistics = await getStatisticsPostGuiders(
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

  const { post, paging }: { post: PostGuider[]; paging: Pagination } =
    await getPostGuidersPopup(
      {
        ...searchParams,
        post_owner_id: Number(userId),
      } || {
        page: 1,
        limit: SHRINK_LIMIT,
        post_owner_id: userId,
      }
    );

  return (
    <ClientOnly>
      <StatisticsGuiderClient
        posts={post}
        paging={paging}
        data={resultStatistics}
      />
    </ClientOnly>
  );
};

export default StatisticsGuiderPage;
