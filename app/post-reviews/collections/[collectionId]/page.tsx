import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostCollectionClient from "./PostCollectionClient";
import getPostReviewsByTopicId from "@/app/actions/getPostReviewsByTopicId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { PostReview } from "@/models/post";
import { Pagination, PostReviewByTopicId } from "@/models/api";
import { getTopicName } from "@/utils/getTopic";
import enJSON from "@/i18n/translations/en";
import viJSON from "@/i18n/translations/vi";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { collectionId: number };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const type = getTopicName(Number(params.collectionId));

  return {
    title:
      lang === "vi"
        ? `Chủ đề: ${(viJSON["type-selections"] as any)[type]}`
        : `Post collection: ${(enJSON["type-selections"] as any)[type]}`,
  };
}

const PostCollectionClientPage = async ({
  params,
  searchParams,
}: {
  params: { collectionId: number | string };
  searchParams: PostReviewByTopicId;
}) => {
  const { post, paging }: { post: PostReview[]; paging: Pagination } =
    await getPostReviewsByTopicId(
      {
        ...searchParams,
        topic_id: Number(params?.collectionId),
      } || {
        date_from: null,
        date_to: null,
        page: 1,
        limit: LIMIT,
        lat: null,
        lng: null,
        topic_id: Number(params?.collectionId),
      }
    );

  if (!post || post?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          showReset
          location={`/post-reviews/collections/${params?.collectionId}`}
        />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <PostCollectionClient topic={Number(params?.collectionId)} data={post} />
      {Number(paging?.total ?? 0) > (Number(paging?.limit) || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={paging?.total || LIMIT}
          limit={paging?.limit || LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export default PostCollectionClientPage;
