import axios from "axios";

import { LIMIT } from "@/const";
import { Pagination, PostGuiderByTopicId } from "@/models/api";
import { PostGuider } from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getPostGuidersPopup({
  page,
  limit,
  post_owner_id,
}: PostGuiderByTopicId): Promise<{ post: PostGuider[]; paging: Pagination }> {
  try {
    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        post_owner_id: post_owner_id || null,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.PostGuiderList),
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
