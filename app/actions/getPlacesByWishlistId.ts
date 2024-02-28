import axios from "axios";
import { API_URL, LIMIT } from "@/const";
import { cookies } from "next/headers";
import { FavoriteAPI, PlaceWishlistAPI } from "@/models/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPlacesByWishlistId({
  wish_list_id,
  page,
  limit,
}: PlaceWishlistAPI):Promise<FavoriteAPI | undefined> {
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
      `${API_URL}/place_wish_lists/place`,
      config
    );

    const places = response?.data?.data;
    const paging = response?.data?.paging;

    return { places, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
