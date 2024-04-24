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
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

const ReservationPage = async ({
  params,
}: {
  params: { reservationsId: number };
}) => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);

  const reservation: ReservationSec | undefined = await getReservationById(
    params.reservationsId
  );
  const rating: RatingDataSubmit = await getRatingByReservationId(
    params.reservationsId
  );

  if (!accessToken || !userId || user?.role === getRoleId(Role.Admin))
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );

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
