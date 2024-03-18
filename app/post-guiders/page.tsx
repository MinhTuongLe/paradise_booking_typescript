import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import PostGuidersClient from "./PostGuidersClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Post Reviews",
  };
}

const PostGuidersPage = async () => {
  // const accessToken = cookies().get("accessToken")?.value;
  // const userId = cookies().get("userId")?.value;
  // const user = await getUserById(userId);
  // if (!accessToken || user?.role === 3) {
  //   return (
  //     <ClientOnly>
  //       <EmptyState title="Unauthorized" subtitle="Please login" />
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
