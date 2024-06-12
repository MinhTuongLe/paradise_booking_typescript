import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { Pagination } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { Report } from "@/models/report";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getReports({
  page,
  limit,
  status,
  user_id,
}: Pagination & { status: string; user_id: string | number }): Promise<{
  reports: Report[];
  paging: Pagination;
}> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        status: status ?? "",
        user_id: user_id ?? "",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(
      getApiRoute(RouteKey.ReportList),
      null,
      config
    );

    const reports = response?.data?.data;
    const paging = response?.data?.paging;

    return { reports, paging };
  } catch (error) {
    console.log("Something went wrong");
    return { reports: [], paging: { page: 1, limit: 5, total: 5 } };
  }
}
