import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import StatisticsClient from "./StatisticsClient";
import getUserById from "@/app/actions/getUserById";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const StatisticsPage = async () => {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!user || user.role !== 2) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
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
