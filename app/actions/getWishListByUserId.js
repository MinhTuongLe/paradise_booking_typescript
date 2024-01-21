import axios from "axios";
import { API_URL, LIMIT } from "@/const";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};
export default async function getWishListByUserId(user_id) {
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
      `${API_URL}/wish_lists/user/${user_id}`,
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
