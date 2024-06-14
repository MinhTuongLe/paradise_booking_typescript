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
  status_id,
  user_id,
  object_type,
}: Pagination & {
  status_id: string | number;
  user_id: string | number;
  object_type: string;
}): Promise<{
  reports: Report[];
  paging: Pagination;
}> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        status_id: status_id ?? "",
        user_id: user_id ?? "",
        object_type: object_type ?? "",
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
