import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostGuiderClient from "./MyPostGuiderClient";
import getUserById from "@/app/actions/getUserById";
import getPlaceById from "@/app/actions/getPlaceById";
import getReservationByPlaceId from "@/app/actions/getReservationByPlaceId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { Pagination, ReservationsAPI } from "@/models/api";
import { Place } from "@/models/place";

export const dynamic = "force-dynamic";

const MyPostGuiderPage = async ({
  params,
  searchParams,
}: {
  params: { propertiesId: string | number };
  searchParams: Pagination;
}) => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  // if (!accessToken || !userId || !user || user.role !== getRoleId(Role.Vendor)) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  try {
    // const placeData = await getPlaceById(params?.propertiesId);

    // if (!placeData || !placeData.place) {
    //   return <EmptyState title="Place Not Found" />;
    // }

    // const { place } = placeData;

    // const obj = await getReservationByPlaceId({
    //   placeId: params?.propertiesId,
    //   page: searchParams.page || 1,
    //   limit: searchParams.limit || LIMIT,
    // });

    return (
      <ClientOnly>
        <MyPostGuiderClient place={undefined} reservations={[]} />
        {/* {obj && obj.paging?.total > (obj.paging?.limit || LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={obj?.paging?.total || LIMIT}
            limit={obj?.paging?.limit || LIMIT}
          />
        )} */}
      </ClientOnly>
    );
  } catch (error) {
    console.error("Error fetching place:", error);
    return <EmptyState title="Error" subtitle="Failed to fetch place" />;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { propertiesId: number };
}): Promise<Metadata> {
  // const placeData = await getPlaceById(
  //   params?.propertiesId
  // );
  return {
    title: "Post Guider Name",
  };
}

export default MyPostGuiderPage;
