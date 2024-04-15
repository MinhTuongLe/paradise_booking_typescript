import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PostReviewClient from "./PostReviewClient";
import getUserById from "@/app/actions/getUserById";
import getReservationById from "@/app/actions/getReservationById";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";
import { RatingDataSubmit } from "@/models/api";
import { ReservationSec } from "@/models/place";

export const dynamic = "force-dynamic";

const PostReviewPage = async ({
  params,
}: {
  params: { postReviewId: number | string };
}) => {
  // const reservation = await getReservationById(params.reservationsId);

  // // let authorized = false;
  // let reservation, rating;
  // if (user.role !== getRoleId(Role.Admin)) {
  //   reservation = await getReservationById(params.reservationsId);
  //   rating = await getRatingByReservationId(params.reservationsId);
  //   // authorized = true;
  // }

  // const reservation: ReservationSec | undefined = awai{params}t getReservationById(
  //   params.reservationsId
  // );
  // const rating: RatingDataSubmit = await getRatingByReservationId(
  //   params.reservationsId
  // );

  // if (!authorized)
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;

  return (
    <ClientOnly>
      <PostReviewClient />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Post Review Details`,
  };
}

export default PostReviewPage;
