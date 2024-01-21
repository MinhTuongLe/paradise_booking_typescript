import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import ReservationsClient from "./ReservationsClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";

export const dynamic = "force-dynamic";

const ReservationsPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!accessToken || user?.role === 3) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient />
    </ClientOnly>
  );
};

export default ReservationsPage;
