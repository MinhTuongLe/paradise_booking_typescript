import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { Pagination } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { Guider } from "@/models/user";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getGuiderRequests({
  page,
  limit,
  status,
  user_id,
}: Pagination & { status: string; user_id: string | number }): Promise<{
  requests: Guider[];
  paging: Pagination;
}> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        status: status || "",
        user_id: user_id || "",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.GetRequestGuiderList),
      config
    );

    const requests = response?.data?.data;
    const paging = response?.data?.paging;

    return { requests, paging };
  } catch (error) {
    console.log("Something went wrong");
    return { requests: [], paging: { page: 1, limit: 5, total: 5 } };
  }
}
