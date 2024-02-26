import getPlaceById from "@/app/actions/getPlaceById";
import getUserById from "@/app/actions/getUserById";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ListingClient from "@/components/ListingClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const ListingPage = async ({ params }: { params: any }) => {
  const { place, vendor_id }: any = await getPlaceById(params.listingId);

  const vendor = await getUserById(vendor_id);

  if (!place) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

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
  const { place, vendor_id }: any = await getPlaceById(params.listingId);
  return {
    title:  `Place: ${place.name || '-'}`,
  };
}

export default ListingPage;
