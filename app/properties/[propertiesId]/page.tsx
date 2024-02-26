import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PropertyClient from "./PropertyClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getPlaceById from "@/app/actions/getPlaceById";
import getReservationByPlaceId from "@/app/actions/getReservationByPlaceId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { ReservationsAPI } from "@/models/api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PropertyPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  let place = [];
  let obj: ReservationsAPI | undefined = {
    reservations: [],
    paging: {
      total: 0,
      limit: LIMIT,
      page: 1,
    },
  };
  if (accessToken && user.role === 2) {
    const { place: fetchedPlace, vendor_id }: any = await getPlaceById(
      params?.propertiesId
    );
    place = fetchedPlace;

    obj = await getReservationByPlaceId({
      placeId: params?.propertiesId,
      page: searchParams.page || 1,
      limit: searchParams.limit || LIMIT,
    });
  } else {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <ClientOnly>
      <PropertyClient place={place} reservations={obj?.reservations} />
      {obj && obj.paging?.total > (obj.paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj?.paging?.total || LIMIT}
          limit={obj?.paging?.limit || LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { propertiesId: number };
}): Promise<Metadata> {
  const { place: fetchedPlace, vendor_id }: any = await getPlaceById(
    params?.propertiesId
  );
  return {
    title: fetchedPlace.name || "Property Name",
  };
}

export default PropertyPage;
