import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { Pagination, PlaceAPI } from "@/models/api";
import { Place } from "@/models/place";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getUserEmail = async () => {
  const user_email = cookies().get("user_email")?.value;
  return user_email;
};

export default async function getPlacesPopup({
  page,
  limit,
  place_id,
}: PlaceAPI): Promise<{ places: Place[]; paging: Pagination }> {
  try {
    const userEmail = await getUserEmail();
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        place_id: place_id ? place_id : null,
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
