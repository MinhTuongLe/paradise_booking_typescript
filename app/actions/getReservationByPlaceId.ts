import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT } from "@/const";
import { ReservationAPI, ReservationsAPI } from "@/models/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getReservationByPlaceId({
  placeId,
  page,
  limit,
}: ReservationAPI): Promise<ReservationsAPI | undefined> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        place_id: placeId,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
    };
    const response = await axios.get(`${API_URL}/bookings`, config);

    const reservations = response?.data?.data;
    const paging = response?.data?.paging;

    return { reservations, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
