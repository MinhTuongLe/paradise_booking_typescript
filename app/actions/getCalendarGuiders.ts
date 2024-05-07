import axios from "axios";

import { LIMIT } from "@/const";
import { Pagination, CalendarGuiders } from "@/models/api";
import { CalendarPostGuider, PostGuider } from "@/models/post";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export default async function getCalendarGuiders({
  page,
  limit,
  post_guide_id,
  guider_id,
  date_from,
  date_to,
}: CalendarGuiders): Promise<{
  calendar: CalendarPostGuider[];
  paging: Pagination;
}> {
  try {
    const config = {
      params: {
        guider_id: guider_id,
        post_guide_id: post_guide_id,
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
        date_from: date_from || null,
        date_to: date_to || null,
      },
    };

    const response = await axios.get(
      getApiRoute(RouteKey.CalendarGuiderList),
      config
    );

    console.log("response: ", response);

    const calendar = response?.data?.data;
    const paging = response?.data?.paging;

    return { calendar, paging };
  } catch (error) {
    console.log("Something went wrong");
    return { calendar: [], paging: { page: 1, limit: 5, total: 5 } };
  }
}
