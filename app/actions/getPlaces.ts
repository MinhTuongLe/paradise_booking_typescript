import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT } from "@/const";
import { Pagination, PlaceAPI } from "@/models/api";
import { Place } from "@/models/place";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getUserEmail = async () => {
  const user_email = cookies().get("user_email")?.value;
  return user_email;
};

export default async function getPlaces({
  page,
  limit,
  guest,
  price_from,
  price_to,
  lat,
  lng,
  date_from,
  date_to,
}: PlaceAPI): Promise<{ places: Place[]; paging: Pagination }> {
  try {
    const userEmail = await getUserEmail();
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        guest: guest || null,
        price_from: price_from || null,
        price_to: price_to || null,
        lat: lat || null,
        lng: lng || null,
        date_from: date_from || null,
        date_to: date_to || null,
      },
    };

    const response = await axios.post(
      getApiRoute(RouteKey.PlaceList),
      {
        user_email: userEmail || "",
      },
      config
    );

    const places = response?.data?.data;
    const paging = response?.data?.paging;

    return { places, paging };
  } catch (error) {
    console.log("Something went wrong");
    return { places: [], paging: { page: 1, limit: 5, total: 5 } };
  }
}
