import axios from "axios";

import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { BookingGuider } from "@/models/post";

export default async function getBookingGuiderById(
  bookedGuiderId: number
): Promise<BookingGuider | undefined> {
  try {
    const response = await axios.get(
      getApiRoute(RouteKey.BookingGuiderDetails, {
        bookedGuiderId,
      })
    );

    const reservation = response.data.data;

    return reservation;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
