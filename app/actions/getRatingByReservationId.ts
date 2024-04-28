import axios from "axios";
import { cookies } from "next/headers";

import { API_URL } from "@/const";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getRatingByReservationId(reservationId: number) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      getApiRoute(RouteKey.BookingRatingsByReservation, {
        reservationId,
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const reservation = response.data.data[0].DataRating;

    return reservation;
  } catch (error) {
    console.log("Something went wrong");
  }
}
