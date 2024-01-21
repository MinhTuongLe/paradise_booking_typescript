import axios from "axios";
import { API_URL } from "@/const";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getRatingByReservationId(reservationId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `${API_URL}/booking_ratings/bookings/${reservationId}`,
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
