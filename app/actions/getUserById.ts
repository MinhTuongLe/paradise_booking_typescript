import axios from "axios";
import { cookies } from "next/headers";

import { API_URL } from "@/const";
import { User } from "@/models/user";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getUserById(
  userId: number | string | undefined
): Promise<User | undefined> {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      getApiRoute(RouteKey.UserDetails, { userId }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const user = response.data.data;

    return user;
  } catch (error) {
    console.log("Something went wrong");
  }
}
