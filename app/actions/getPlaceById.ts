import axios from "axios";
import { cookies } from "next/headers";

import { API_URL } from "@/const";
import { PlaceAPISec } from "@/models/api";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";

const getUserEmail = async () => {
  const user_email = cookies().get("user_email")?.value;
  return user_email;
};

export default async function getPlaceById(
  listingId: number | string
): Promise<PlaceAPISec | undefined> {
  try {
    const userEmail = await getUserEmail();

    const response = await axios.get(getApiRoute(RouteKey.PlaceDetails, { listingId }), {
      params: {
        user_email: userEmail || "",
      },
    });

    const place = response.data;

    return {
      place: place.data,
      vendor_id: place.data.vendor_id,
    };
  } catch (error) {
    console.log("Something went wrong");
  }
}
