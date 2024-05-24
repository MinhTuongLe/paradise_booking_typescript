import axios from "axios";
import { cookies } from "next/headers";

import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { Guider } from "@/models/user";

export default async function getGuiderRequestByUserId(
  user_id: number | string | undefined
): Promise<Guider | undefined> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.GetRequestGuiderByUser, {
        user_id,
      }),
      config
    );

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong");
  }
}
