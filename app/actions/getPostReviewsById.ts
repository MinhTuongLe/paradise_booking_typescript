import axios from "axios";

import { API_URL } from "@/const";
import { PostReview } from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getPostReviewById(
  postReviewId: number | string
): Promise<PostReview | undefined> {
  try {
    const response = await axios.get(
      getApiRoute(RouteKey.PostReviewDetails, { postReviewId }),
      {
        params: {
          // account_id: 103,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("Something went wrong");
  }
}
