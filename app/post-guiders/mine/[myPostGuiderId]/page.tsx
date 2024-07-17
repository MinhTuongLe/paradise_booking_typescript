import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import { CalendarPostGuider, PostGuider } from "@/models/post";
import getPostGuiderById from "@/app/actions/getPostGuiderById";
import EmptyState from "@/components/EmptyState";
import MyPostGuiderClient from "./MyPostGuiderClient";
import getCalendarGuiders from "@/app/actions/getCalendarGuiders";
import { CalendarGuiders, Pagination } from "@/models/api";
import { SHRINK_LIMIT } from "@/const";
import getReservationByPostGuiderId from "@/app/actions/getReservationByPostGuiderId";
import PaginationComponent from "@/components/PaginationComponent";

export const dynamic = "force-dynamic";

const MyPostGuiderPage = async ({
  params,
  searchParams,
}: {
  params: { myPostGuiderId: number | string };
  searchParams: CalendarGuiders;
}) => {
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.myPostGuiderId
  );

  const userId = cookies().get("userId")?.value;
  const {
    calendar,
    paging,
  }: { calendar: CalendarPostGuider[]; paging: Pagination } =
    await getCalendarGuiders(
      searchParams || {
        page: 1,
        limit: SHRINK_LIMIT,
        date_from: null,
        date_to: null,
      },
      params.myPostGuiderId,
      userId
    );

  const obj = await getReservationByPostGuiderId({
    post_guide_id: Number(params?.myPostGuiderId),
    guider_id: Number(userId),
    page: searchParams.page || 1,
    limit: searchParams.limit || SHRINK_LIMIT,
  });

  if (!postGuiderData) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <MyPostGuiderClient
        data={postGuiderData}
        postGuiderId={params.myPostGuiderId}
        calendar={calendar}
        calendarPaging={paging}
        reservations={obj?.reservations}
      />
      {obj &&
        Number(obj.paging?.total ?? 0) >
          (Number(obj.paging?.limit) || SHRINK_LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={obj?.paging?.total || SHRINK_LIMIT}
            limit={obj?.paging?.limit || SHRINK_LIMIT}
          />
        )}
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { myPostGuiderId: number | string };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.myPostGuiderId
  );

  return {
    title:
      postGuiderData?.title ||
      (lang === "vi" ? "Chi tiết bài đăng" : "Post Guider Details"),
  };
}

export default MyPostGuiderPage;
