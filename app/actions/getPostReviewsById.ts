import axios from "axios";

import { PostReview } from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getPostReviewById(
  postReviewId: number | string
): Promise<PostReview | undefined> {
  try {
    const response = await axios.get(
      getApiRoute(RouteKey.PostReviewDetails, { postReviewId })
    );

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong");
  }
}
