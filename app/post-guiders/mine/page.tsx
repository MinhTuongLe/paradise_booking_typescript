import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import MyPostGuidersClient from "./MyPostGuidersClient";
import { Pagination, PostGuiderByTopicId } from "@/models/api";
import { PostGuider } from "@/models/post";
import getPostGuidersByTopicId from "@/app/actions/getPostGuidersByTopicId";
import { LIMIT } from "@/const";

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
  const userId = cookies().get("userId")?.value;

  const { post, paging }: { post: PostGuider[]; paging: Pagination } =
    await getPostGuidersByTopicId(
      {
        ...searchParams,
        post_owner_id: Number(userId),
      } || {
        page: 1,
        limit: LIMIT,
        lat: null,
        lng: null,
        post_owner_id: userId,
      }
    );

  return (
    <ClientOnly>
      <MyPostGuidersClient data={post} paging={paging} />
      {/* {paging?.total && paging.total > (paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={paging?.total || LIMIT}
          limit={paging?.limit || LIMIT}
        />
      )} */}
    </ClientOnly>
  );
};

export default MyPostGuidersPage;
