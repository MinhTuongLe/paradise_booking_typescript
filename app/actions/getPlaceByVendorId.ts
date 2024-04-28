import axios from "axios";

import { API_URL, LIMIT } from "@/const";
import { FavoriteAPI, PlaceVendorAPI } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getPlaceByVendorId({
  vendor_id,
  page,
  limit,
}: PlaceVendorAPI): Promise<FavoriteAPI | undefined> {
  try {
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
    };
    const response = await axios.get(
      getApiRoute(RouteKey.PlaceListByOwner, { vendor_id }),
      config
    );

    const places = response?.data?.data;
    const paging = response?.data?.paging;

    return { places, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
