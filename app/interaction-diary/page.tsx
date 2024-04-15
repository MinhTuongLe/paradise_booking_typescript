import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import InteractionDiaryClient from "./InteractionDiaryClient";
import getUserById from "@/app/actions/getUserById";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Interaction Diary",
  };
}

const InteractionDiaryPage = async () => {
  // const accessToken = cookies().get("accessToken")?.value;
  // const userId = cookies().get("userId")?.value;
  // const user = await getUserById(userId);
  // if (!accessToken || user?.role === getRoleId(Role.Admin)) {
  //   return (
  //     <ClientOnly>
  //       <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />
  //     </ClientOnly>
  //   );
  // }

  return (
    <ClientOnly>
      <InteractionDiaryClient />
    </ClientOnly>
  );
};

export default InteractionDiaryPage;
