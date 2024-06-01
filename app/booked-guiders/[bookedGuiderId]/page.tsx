import { cookies } from "next/headers";
import { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import BookedGuiderClient from "./BookedGuiderClient";
import getBookingGuiderById from "@/app/actions/getBookingGuiderById";
import { BookingGuider } from "@/models/post";
import { User } from "@/models/user";
import getUserByEmail from "@/app/actions/getUserByEmail";
import { RatingDataSubmit } from "@/models/api";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";
import { BookingRatingType } from "@/enum";

export const dynamic = "force-dynamic";

const ReservationPage = async ({
  params,
}: {
  params: { bookedGuiderId: number };
}) => {
  const reservation: BookingGuider | undefined = await getBookingGuiderById(
    params.bookedGuiderId
  );
  let user: User | null | undefined = null;

  if (reservation) {
    const email = reservation.email;
    if (email) {
      user = await getUserByEmail(email);
    }
  }

  const rating: RatingDataSubmit = await getRatingByReservationId({
    reservationId: params.bookedGuiderId,
    object_type: BookingRatingType.BookingRatingTypeGuide,
  });

  if (!reservation) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <BookedGuiderClient data={reservation} user={user} rating={rating} />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Thông tin đặt lịch" : "Reservation Details",
  };
}

export default ReservationPage;
