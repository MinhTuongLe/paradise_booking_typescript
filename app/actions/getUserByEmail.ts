import axios from "axios";

import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getUserByEmail(
  email: string
): Promise<undefined> {
  try {
    const config = {
      params: {
        email,
      },
    };
    const response = await axios.get(getApiRoute(RouteKey.Profile), config);

    const user = response?.data?.data;

    return user;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
