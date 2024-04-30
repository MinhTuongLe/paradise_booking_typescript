import type { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostCollectionClient from "./PostCollectionClient";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { PostGuider } from "@/models/post";
import { Pagination, PostGuiderByTopicId } from "@/models/api";
import { getTopicName } from "@/utils/getTopic";
import getPostGuidersByTopicId from "@/app/actions/getPostGuidersByTopicId";
import { getPostGuiderTypeName } from "@/utils/getPostGuiderType";
import { PostGuiderTypesEn } from "@/i18n/serverTranslation/en";
import { PostGuiderTypesVi } from "@/i18n/serverTranslation/vi";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { postGuiderTypeId: number };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const type = getPostGuiderTypeName(Number(params.postGuiderTypeId));

  return {
    title:
      lang === "vi"
        ? `Chủ đề: ${(PostGuiderTypesVi as any)[type]}`
        : `Post collection: ${(PostGuiderTypesEn as any)[type]}`,
  };
}

const PostCollectionClientPage = async ({
  params,
  searchParams,
}: {
  params: { postGuiderTypeId: number | string };
  searchParams: PostGuiderByTopicId;
}) => {
  const { post, paging }: { post: PostGuider[]; paging: Pagination } =
    await getPostGuidersByTopicId(
      {
        ...searchParams,
        topic_id: Number(params?.postGuiderTypeId),
      } || {
        page: 1,
        limit: LIMIT,
        lat: null,
        lng: null,
        topic_id: Number(params?.postGuiderTypeId),
      }
    );

  if (!post || post?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          showReset
          location={`/post-guiders/collections/${params?.postGuiderTypeId}`}
        />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <PostCollectionClient
        topic={Number(params?.postGuiderTypeId)}
        data={post}
      />
      {paging?.total && paging.total > (paging?.limit || LIMIT) && (
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
