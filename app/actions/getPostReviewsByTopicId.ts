import axios from "axios";
import { cookies } from "next/headers";

import { API_URL, LIMIT } from "@/const";
import { Pagination, PostReviewByTopicId } from "@/models/api";
import { PostReview } from "@/models/post";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPostReviewsByTopicId({
  topic_id,
  date_from,
  date_to,
  lat,
  lng,
  page,
  limit,
}: PostReviewByTopicId): Promise<{ post: PostReview[]; paging: Pagination }> {
  try {
    const config = {
      params: {
        topic_id: topic_id || null,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        lat: lat || null,
        lng: lng || null,
        date_from: date_from || null,
        date_to: date_to || null,
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
