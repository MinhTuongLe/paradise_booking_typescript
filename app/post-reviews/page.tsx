import type { Metadata } from "next";
import React from "react";

import ClientOnly from "@/components/ClientOnly";
import PostReviewsClientClient from "./PostReviewsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Post Reviews",
  };
}

const PostReviewsPage = async () => {
  return (
    <ClientOnly>
      <PostReviewsClientClient />
    </ClientOnly>
  );
};

export default PostReviewsPage;
