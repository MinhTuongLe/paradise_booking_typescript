import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import PostGuidersClient from "./PostGuidersClient";
import getPostGuidersByTopicId from "../actions/getPostGuidersByTopicId";
import { PostGuider } from "@/models/post";
import { Pagination, PostGuiderByTopicId } from "@/models/api";
import { LIMIT } from "@/const";
import EmptyState from "@/components/EmptyState";
import PaginationComponent from "@/components/PaginationComponent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Hướng dẫn viên" : "Post Guiders",
  };
}

const PostGuidersPage = async ({
  searchParams,
}: {
  searchParams: PostGuiderByTopicId;
}) => {
  const { post, paging }: { post: PostGuider[]; paging: Pagination } =
    await getPostGuidersByTopicId(
      searchParams || {
        page: 1,
        limit: LIMIT,
        lat: null,
        lng: null,
      }
    );

  if (!post || post?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset location="/post-guiders" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PostGuidersClient data={post} />
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

export default PostGuidersPage;
