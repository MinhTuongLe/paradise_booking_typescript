import { cookies } from "next/headers";
import { Metadata } from "next";

import ReservationClient from "./ReservationClient";
import ClientOnly from "@/components/ClientOnly";
import getReservationById from "@/app/actions/getReservationById";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";
import { RatingDataSubmit } from "@/models/api";
import { ReservationSec } from "@/models/place";
import { BookingRatingType } from "@/enum";

export const dynamic = "force-dynamic";

const ReservationPage = async ({
  params,
}: {
  params: { reservationsId: number };
}) => {
  const reservation: ReservationSec | undefined = await getReservationById(
    params.reservationsId
  );
  const rating: RatingDataSubmit = await getRatingByReservationId({
    reservationId: params.reservationsId,
    object_type: BookingRatingType.BookingRatingTypePlace,
  });

  return (
    <ClientOnly>
      <ReservationClient reservation={reservation} rating={rating} />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { reservationsId: number };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  const reservation: ReservationSec | undefined = await getReservationById(
    params.reservationsId
  );
  return {
    title: `${lang === "vi" ? "Đặt phòng" : "Reservation"}: ${
      reservation?.data.place.name || "-"
    }`,
  };
}

export default ReservationPage;
