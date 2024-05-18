import { cookies } from "next/headers";
import { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import BookedGuiderClient from "./BookedGuiderClient";
import getUserById from "@/app/actions/getUserById";
import getBookingGuiderById from "@/app/actions/getBookingGuiderById";
import { BookingGuider } from "@/models/post";
import { User } from "@/models/user";
import getUserByEmail from "@/app/actions/getUserByEmail";

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

  // // let authorized = false;
  // let reservation, rating;
  // if (user.role !== getRoleId(Role.Admin)) {
  //   reservation = await getReservationById(params.bookedGuiderId);
  //   rating = await getRatingByReservationId(params.bookedGuiderId);
  //   // authorized = true;
  // }

  // const reservation: ReservationSec | undefined = await getReservationById(
  //   params.bookedGuiderId
  // );
  // const rating: RatingDataSubmit = await getRatingByReservationId(
  //   params.bookedGuiderId
  // );

  if (!reservation) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <BookedGuiderClient data={reservation} user={user} />
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
