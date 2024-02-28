import axios from "axios";
import { API_URL, SHRINK_LIMIT } from "@/const";
import { cookies } from "next/headers";
import { PaymentAPI, PlaceVendorAPI } from "@/models/api";
import { Payment } from "@/models/payment";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getPaymentByVendorId({
  vendor_id,
  booking_id,
  page,
  limit,
}: PlaceVendorAPI):Promise<PaymentAPI | undefined> {
  try {
    const accessToken = await getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        booking_id: booking_id || null,
        vendor_id,
        page: page ? page : 1,
        limit: limit ? limit : SHRINK_LIMIT,
      },
    };
    const response = await axios.post(
      `${API_URL}/payments/list_by_vendor`,
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
