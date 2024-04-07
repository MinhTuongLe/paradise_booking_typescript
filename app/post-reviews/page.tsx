import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostReviewsClientClient from "./PostReviewsClient";
import getUserById from "@/app/actions/getUserById";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Post Reviews",
  };
}

const PostReviewsPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  
  if (!accessToken || !userId) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PostReviewsClientClient />
    </ClientOnly>
  );
};

export default PostReviewsPage;
