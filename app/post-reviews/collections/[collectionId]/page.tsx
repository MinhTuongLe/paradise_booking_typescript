import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostCollectionClient from "./PostCollectionClient";
import getUserById from "@/app/actions/getUserById";
import getPostReviewsByTopicId from "@/app/actions/getPostReviewsByTopicId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { PostReview } from "@/models/post";
import { Pagination } from "@/models/api";
import { getTopicName } from "@/utils/getTopic";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { collectionId: number };
}): Promise<Metadata> {
  return {
    title: `Post collection: ${getTopicName(Number(params.collectionId))}`,
  };
}

const PostCollectionClientPage = async ({
  params,
}: {
  params: { collectionId: number | string };
}) => {
  return (
    <ClientOnly>
      <PostCollectionClient topic={Number(params?.collectionId)} />
    </ClientOnly>
  );
};

export default PostCollectionClientPage;
