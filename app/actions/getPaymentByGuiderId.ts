import axios from "axios";
import { cookies } from "next/headers";

import { SHRINK_LIMIT } from "@/const";
import { PaymentAPI, PaymentGuiderAPI } from "@/models/api";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPaymentByGuiderId({
  guider_id,
  booking_id,
  page,
  limit,
}: PaymentGuiderAPI): Promise<PaymentAPI | undefined> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        booking_id: booking_id || null,
        guider_id,
        page: page ? page : 1,
        limit: limit ? limit : SHRINK_LIMIT,
      },
    };
    const response = await axios.post(
      getApiRoute(RouteKey.PaymentListByGuider),
      null,
      config
    );

    const payments = response?.data?.data;
    const paging = response?.data?.paging;

    return { payments, paging };
  } catch (error) {
    console.log(error);
    console.log("Something went wrong");
  }
}
