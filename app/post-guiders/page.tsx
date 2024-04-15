import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostGuidersClient from "./PostGuidersClient";
import getUserById from "@/app/actions/getUserById";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Post Guiders",
  };
}

const PostGuidersPage = async () => {
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
      <PostGuidersClient />
    </ClientOnly>
  );
};

export default PostGuidersPage;
