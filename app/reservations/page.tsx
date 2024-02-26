import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import ReservationsClient from "./ReservationsClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Reservations",
  };
}

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
