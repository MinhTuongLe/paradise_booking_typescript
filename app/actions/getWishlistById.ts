import axios from "axios";
import { cookies } from "next/headers";

import { API_URL } from "@/const";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getWishlistById(
  wish_list_id: number | string | undefined
) {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.WishlistDetails, {
        wishlistId: wish_list_id,
      }),
      config
    );

    const places = response.data.data;

    return places;
  } catch (error) {
    console.log("Something went wrong");
  }
}
