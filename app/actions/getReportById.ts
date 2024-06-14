import axios from "axios";
import { cookies } from "next/headers";

import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";
import { Report } from "@/models/report";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getReportById(
  reportId: number | string
): Promise<Report | undefined> {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      getApiRoute(RouteKey.ReportDetails, { reportId }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const report = response.data;

    return report;
  } catch (error) {
    console.log("Something went wrong");
  }
}
