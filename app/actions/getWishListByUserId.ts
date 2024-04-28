import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT } from "@/const";
import { Wishlist } from "@/models/wishlist";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};
export default async function getWishListByUserId(
  user_id: number | string
): Promise<Wishlist[]> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // params: {
      //   page: params.get("page") || 1,
      //   limit: params.get("limit") || LIMIT,
      // },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.WishlistsByUser, {
        userId: user_id,
      }),
      config
    );

    const wish_lists = response?.data?.data || [];
    // const paging = response?.data?.paging;

    return wish_lists;
  } catch (error) {
    console.log("Something went wrong");
    return [];
  }
}
