import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ReservationClient from "./ReservationClient";
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
  params: { reservationsId: number };
}) => {
  // const accessToken = cookies().get("accessToken")?.value;
  // const userId = cookies().get("userId")?.value;
  // const user = await getUserById(userId);
  // const reservation = await getReservationById(params.reservationsId);

  // // let authorized = false;
  // let reservation, rating;
  // if (user.role !== getRoleId(Role.Admin)) {
  //   reservation = await getReservationById(params.reservationsId);
  //   rating = await getRatingByReservationId(params.reservationsId);
  //   // authorized = true;
  // }

  const reservation: ReservationSec | undefined = await getReservationById(
    params.reservationsId
  );
  const rating: RatingDataSubmit = await getRatingByReservationId(
    params.reservationsId
  );

  // if (!authorized)
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;

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
