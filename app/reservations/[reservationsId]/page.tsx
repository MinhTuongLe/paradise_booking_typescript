import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ReservationClient from "./ReservationClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getReservationById from "@/app/actions/getReservationById";
import getRatingByReservationId from "@/app/actions/getRatingByReservationId";

export const dynamic = "force-dynamic";

const ReservationPage = async ({ params }: { params: any }) => {
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

  const reservation = await getReservationById(params.reservationsId);
  const rating = await getRatingByReservationId(params.reservationsId);

  // if (!authorized)
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;

  return (
    <ClientOnly>
      <ReservationClient reservation={reservation} rating={rating} />
    </ClientOnly>
  );
};

export default ReservationPage;
