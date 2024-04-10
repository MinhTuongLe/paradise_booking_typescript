import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT, Topic } from "@/const";
import { PostReviewByTopicId } from "@/models/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPostReviewsByTopicId(
  account_id: number,
  topic_id: Topic,
  page: number,
  limit: number
): Promise<PostReviewByTopicId | undefined> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        account_id,
        topic_id,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${API_URL}/post_reviews/list`, config);

    const reservation = response.data;

    return reservation;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
