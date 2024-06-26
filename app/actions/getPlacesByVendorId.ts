import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { Pagination, PlaceAPI } from "@/models/api";
import { Place } from "@/models/place";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getVendorId = async () => {
  const userId = cookies().get("userId")?.value;
  return userId;
};

export default async function getPlacesByVendorId({
  page,
  limit,
  date_from,
  date_to,
  place_id,
}: PlaceAPI): Promise<{ places: Place[]; paging: Pagination }> {
  try {
    const vendor_id = await getVendorId();
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        date_from: date_from || null,
        date_to: date_to || null,
        vendor_id: vendor_id || null,
        place_id: place_id || null,
      },
    };

    const response = await axios.post(
      getApiRoute(RouteKey.PlaceList),
      null,
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
