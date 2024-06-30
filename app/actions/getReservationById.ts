import axios from "axios";

import { ReservationSec } from "@/models/place";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getReservationById(
  reservationId: number
): Promise<ReservationSec | undefined> {
  try {
    const response = await axios.get(
      getApiRoute(RouteKey.BookingDetails, {
        reservationId,
      })
    );

    const reservation = response.data;

    return reservation;
  } catch (error) {
    console.log(error);
  }
}
