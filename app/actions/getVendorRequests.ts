import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { Pagination } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { Vendor } from "@/models/user";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getVendorRequests({
  page,
  limit,
  status,
}: Pagination): Promise<{ requests: Vendor[]; paging: Pagination }> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        status: status ?? "",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.GetRequestVendorList),
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
