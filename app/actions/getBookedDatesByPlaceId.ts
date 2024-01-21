import axios from "axios";
import { API_URL } from "@/const";

export default async function getBookedDatesByPlaceId(placeId: number) {
  try {
    const config = {
      params: {
        place_id: placeId,
      },
    };
    const response = await axios.get(`${API_URL}/places/dates_booked`, config);

    const bookedDates = response?.data?.data;

    return bookedDates;
  } catch (error) {
    console.log(error)
    console.log("Something went wrong");
  }
}
