import axios from "axios";
import { cookies } from "next/headers";

import { StatisticsPlaceAPI, StatisticsPlaceAPIProps } from "@/models/api";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";
import { StatisticFilterSelection } from "@/enum";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getStatisticsPostGuiders({
  date_from,
  date_to,
  type,
  post_guide_id,
}: StatisticsPlaceAPIProps): Promise<StatisticsPlaceAPI | undefined> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const data = {
      date_from: date_from || null,
      date_to: date_to || null,
      type: type ? Number(type) : StatisticFilterSelection.DATES,
      post_guide_id: post_guide_id ? Number(post_guide_id) : null,
    };

    const response = await axios.post(
      getApiRoute(RouteKey.StatisticsPostGuide),
      data,
      config
    );

    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
  }
}
