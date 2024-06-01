import axios from "axios";
import { cookies } from "next/headers";

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
    };

    const response = await axios.get(
      getApiRoute(RouteKey.WishlistsByUser, {
        userId: user_id,
      }),
      config
    );

    const wish_lists = response?.data?.data || [];

    return wish_lists;
  } catch (error) {
    console.log("Something went wrong");
    return [];
  }
}
