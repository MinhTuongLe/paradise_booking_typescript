import getPlaceById from "@/app/actions/getPlaceById";
import getUserById from "@/app/actions/getUserById";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ListingClient from "@/components/ListingClient";
import getBookedDatesByPlaceId from "@/app/actions/getBookedDatesByPlaceId";

export const dynamic = "force-dynamic";

const ListingPage = async ({ params }) => {
  const { place, vendor_id } = await getPlaceById(params.listingId);

  const vendor = await getUserById(vendor_id);
  // const bookedDates = await getBookedDatesByPlaceId(params.listingId);

  if (!place) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        // reservations={bookedDates}
        place={place}
        currentUser={vendor}
      />
    </ClientOnly>
  );
};

export default ListingPage;
