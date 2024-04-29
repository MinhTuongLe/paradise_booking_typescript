import axios from "axios";

import { PostGuider } from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getPostGuiderById(
  postGuiderId: number | string
): Promise<PostGuider | undefined> {
  try {
    const response = await axios.get(
      getApiRoute(RouteKey.PostGuiderDetails, { postGuiderId })
    );

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong");
  }
}
