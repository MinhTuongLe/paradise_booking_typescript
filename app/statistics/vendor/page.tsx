import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import StatisticsVendorClient from "./StatisticsVendorClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Statistic",
  };
}
const StatisticsVendorPage = async () => {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!user || user.role !== Role.Vendor) {
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
      <StatisticsVendorClient />
    </ClientOnly>
  );
};

export default StatisticsVendorPage;
