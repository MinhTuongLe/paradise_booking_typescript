import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import PostReviewsClientClient from "./PostReviewsClient";
import getPostReviewsByTopicId from "../actions/getPostReviewsByTopicId";
import { PostReview } from "@/models/post";
import { Pagination, PostReviewByTopicId } from "@/models/api";
import { LIMIT } from "@/const";
import EmptyState from "@/components/EmptyState";
import PaginationComponent from "@/components/PaginationComponent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Bài đăng" : "Post Reviews",
  };
}

const PostReviewsPage = async ({
  searchParams,
}: {
  searchParams: PostReviewByTopicId;
}) => {
  const { post, paging }: { post: PostReview[]; paging: Pagination } =
    await getPostReviewsByTopicId(
      searchParams || {
        date_from: null,
        date_to: null,
        page: 1,
        limit: LIMIT,
        lat: null,
        lng: null,
      }
    );

  if (!post || post?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset location="/post-reviews" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PostReviewsClientClient data={post} />
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

export default PostReviewsPage;
