import axios from "axios";
import { API_URL } from "@/const";
import { ReservationSec } from "@/models/place";

export default async function getReservationById(
  reservationId: number
): Promise<ReservationSec | undefined> {
  try {
    const response = await axios.get(`${API_URL}/bookings/${reservationId}`);

    const reservation = response.data;

    return reservation;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
