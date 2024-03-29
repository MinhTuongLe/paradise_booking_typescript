import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import BookedGuiderClient from "./BookedGuiderClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getReservationById from "@/app/actions/getReservationById";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";
import { Metadata } from "next";
import { RatingDataSubmit } from "@/models/api";
import { ReservationSec } from "@/models/place";

export const dynamic = "force-dynamic";

const ReservationPage = async ({
  params,
}: {
  params: { bookedGuiderId: number };
}) => {
  // const accessToken = cookies().get("accessToken")?.value;
  // const userId = cookies().get("userId")?.value;
  // const user = await getUserById(userId);
  // const reservation = await getReservationById(params.reservationsId);

  // // let authorized = false;
  // let reservation, rating;
  // if (user.role !== 3) {
  //   reservation = await getReservationById(params.reservationsId);
  //   rating = await getRatingByReservationId(params.reservationsId);
  //   // authorized = true;
  // }

  // const reservation: ReservationSec | undefined = await getReservationById(
  //   params.reservationsId
  // );
  // const rating: RatingDataSubmit = await getRatingByReservationId(
  //   params.reservationsId
  // );

  // if (!authorized)
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;

  return (
    <ClientOnly>
      <BookedGuiderClient />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { reservationsId: number };
}): Promise<Metadata> {
  // const reservation: ReservationSec | undefined = await getReservationById(
  //   params.reservationsId
  // );
  return {
    title: `Reservation: Place name - Guider name}`,
  };
}

export default ReservationPage;
