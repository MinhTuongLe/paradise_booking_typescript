import axios from "axios";
import { cookies } from "next/headers";

import { API_URL } from "@/const";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { BookingRatingType } from "@/enum";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

interface RatingByReservationIdProps {
  reservationId: number;
  object_type: BookingRatingType;
}

export default async function getRatingByReservationId({
  reservationId,
  object_type,
}: RatingByReservationIdProps) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      getApiRoute(RouteKey.BookingRatingsByReservation),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          booking_id: reservationId,
          object_type,
        },
      }
    );

    const reservation = response.data.data[0].DataRating;

    return reservation;
  } catch (error) {
    console.log("Something went wrong");
  }
}
