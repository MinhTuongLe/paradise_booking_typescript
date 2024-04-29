import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostGuidersClient from "./MyPostGuidersClient";
import getUserById from "@/app/actions/getUserById";
import { Pagination, PostGuiderByTopicId } from "@/models/api";
import { PostGuider } from "@/models/post";
import getPostGuidersByTopicId from "@/app/actions/getPostGuidersByTopicId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Bài đăng của tôi" : "My Post Guiders",
  };
}
const MyPostGuidersPage = async ({
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
        <EmptyState showReset location="/post-guiders/mine" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <MyPostGuidersClient data={post} />
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

export default MyPostGuidersPage;
