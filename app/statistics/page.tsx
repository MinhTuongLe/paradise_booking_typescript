import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsClient from "./StatisticsClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";
import { getRoleId } from "@/utils/getUserInfo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistic",
  };
}
const StatisticsPage = async () => {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!user || user.role !== getRoleId(Role.Vendor)) {
    return (
      <ClientOnly>
        <EmptyState
          title={t("general.unauthorized")}
          subtitle={t("general.please-login")}
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <StatisticsClient />
    </ClientOnly>
  );
};

export default StatisticsPage;
