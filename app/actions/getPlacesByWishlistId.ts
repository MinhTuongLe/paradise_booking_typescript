import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { FavoriteAPI, PlaceWishlistAPI } from "@/models/api";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPlacesByWishlistId({
  wish_list_id,
  page,
  limit,
}: PlaceWishlistAPI): Promise<FavoriteAPI | undefined> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      params: {
        wish_list_id: wish_list_id,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.WishlistPlaceList),
      config
    );

    const places = response?.data?.data;
    const paging = response?.data?.paging;

    return { places, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
