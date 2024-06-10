import axios from "axios";
import { cookies } from "next/headers";

import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { Vendor } from "@/models/user";

export default async function getVendorRequestByUserId(
  user_id: number | string | undefined
): Promise<Vendor | undefined> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.GetRequestVendorByUser, {
        user_id,
      }),
      config
    );

    console.log("response.data.data: ", response.data.data);

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong");
  }
}
