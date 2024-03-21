import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostReviewsClient from "./MyPostReviewsClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getReservationById from "@/app/actions/getReservationById";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";
import { Metadata } from "next";
import { RatingDataSubmit } from "@/models/api";
import { ReservationSec } from "@/models/place";

export const dynamic = "force-dynamic";

const MyPostReviewsPage = async () => {
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
      <MyPostReviewsClient />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My Post Reviews`,
  };
}

export default MyPostReviewsPage;
