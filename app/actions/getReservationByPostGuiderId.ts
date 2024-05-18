import axios from "axios";
import { cookies } from "next/headers";

import { LIMIT } from "@/const";
import { BookingGuiderApi , BookingGuidersApi} from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getReservationByPostGuiderId({
  post_guide_id,
  page,
  limit,
}: BookingGuiderApi): Promise<BookingGuidersApi | undefined> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: page ? page : 1,
        limit: limit ? limit : LIMIT,
      },
    };
    const response = await axios.post(
      getApiRoute(RouteKey.BookingGuiderList),
      {
        post_guide_id,
      },
      config
    );
    
    const reservations = response?.data?.data;
    const paging = response?.data?.paging;
    
    return { reservations, paging };
  } catch (error) {
    console.log('error: ', error)
    console.log("Something went wrong");
  }
}
