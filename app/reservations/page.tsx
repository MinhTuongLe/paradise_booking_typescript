import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ReservationsClient from "./ReservationsClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  return {
    title: lang === "vi" ? "Danh sách đặt phòng của tôi" : "My Reservations",
  };
}

const ReservationsPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);
  if (!accessToken || user?.role === Role.Admin) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
        />
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
