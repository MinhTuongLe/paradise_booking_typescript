import axios from "axios";
import { API_URL } from "@/const";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getWishlistById(wish_list_id) {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      `${API_URL}/wish_lists/${wish_list_id}`,
      config
    );

    const places = response.data.data;

    return places;
  } catch (error) {
    console.log("Something went wrong");
  }
}
