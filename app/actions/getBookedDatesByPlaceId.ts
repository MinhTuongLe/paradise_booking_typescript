import axios from "axios";
import { API_URL } from "@/const";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getBookedDatesByPlaceId(placeId: number) {
  try {
    const config = {
      params: {
        place_id: placeId,
      },
    };
    const response = await axios.get(
      getApiRoute(RouteKey.PlacesDatesBooked),
      config
    );

    const bookedDates = response?.data?.data;

    return bookedDates;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
