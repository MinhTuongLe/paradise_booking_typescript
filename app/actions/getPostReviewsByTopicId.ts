import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT, Topic } from "@/const";
import { Pagination, PostReviewByTopicId } from "@/models/api";
import { PostReview } from "@/models/post";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPostReviewsByTopicId({
  account_id,
  topic_id,
  page,
  limit,
}: PostReviewByTopicId): Promise<{ post: PostReview[]; paging: Pagination }> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        topic_id,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
    };

    const response = await axios.post(
      `${API_URL}/post_reviews/list`,
      null,
      config
    );

    const post = response?.data?.data?.data;
    const paging = response?.data?.data?.paging;

    return { post, paging };
  } catch (error) {
    console.log("Something went wrong");
    return { post: [], paging: { page: 1, limit: 5, total: 5 } };
  }
}
