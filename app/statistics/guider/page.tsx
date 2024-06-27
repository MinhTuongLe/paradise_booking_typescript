import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsGuiderClient from "./StatisticsGuiderClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistic",
  };
}
const StatisticsGuiderPage = async () => {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!user || user.role !== Role.Guider) {
    return (
      <ClientOnly>
        <EmptyState
        // title={t("general.unauthorized")}
        // subtitle={t("general.please-login")}
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <StatisticsGuiderClient />
    </ClientOnly>
  );
};

export default StatisticsGuiderPage;
