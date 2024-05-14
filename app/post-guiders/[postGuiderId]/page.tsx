import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import { CalendarPostGuider, PostGuider } from "@/models/post";
import PostGuiderClient from "@/components/PostGuiderClient";
import getPostGuiderById from "@/app/actions/getPostGuiderById";
import EmptyState from "@/components/EmptyState";
import getUserById from "@/app/actions/getUserById";
import getCalendarGuiders from "@/app/actions/getCalendarGuiders";
import { LIMIT } from "@/const";
import { Pagination } from "@/models/api";

export const dynamic = "force-dynamic";

const PostGuiderPage = async ({
  params,
}: {
  params: { postGuiderId: number | string };
}) => {
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.postGuiderId
  );

  const {
    calendar,
    paging,
  }: { calendar: CalendarPostGuider[]; paging: Pagination } =
    await getCalendarGuiders(
      {
        page: 1,
        limit: LIMIT,
        date_from: null,
        date_to: null,
      },
      params.postGuiderId,
      postGuiderData?.post_owner_id
    );

  if (!postGuiderData) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PostGuiderClient data={postGuiderData} calendar={calendar} />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { postGuiderId: number | string };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.postGuiderId
  );

  return {
    title:
      postGuiderData?.title ||
      (lang === "vi" ? "Chi tiết bài đăng" : "Post Guider Details"),
  };
}

export default PostGuiderPage;
