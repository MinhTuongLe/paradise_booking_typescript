import getPlaceById from "@/app/actions/getPlaceById";
import getUserById from "@/app/actions/getUserById";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ListingClient from "@/components/ListingClient";
import { PlaceAPISec } from "@/models/api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const ListingPage = async ({
  params,
}: {
  params: { listingId: number | string };
}) => {
  const placeData: PlaceAPISec | undefined =
    await getPlaceById(params.listingId);

  if (!placeData || !placeData.place) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  const { place, vendor_id } = placeData;
  const vendor = await getUserById(vendor_id);

  return (
    <ClientOnly>
      <ListingClient place={place} currentUser={vendor} />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { listingId: number };
}): Promise<Metadata> {
  const placeData: PlaceAPISec | undefined =
    await getPlaceById(params.listingId);
  return {
    title: `Place: ${placeData?.place.name || "-"}`,
  };
}

export default ListingPage;
