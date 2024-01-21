import axios from "axios";
import { API_URL } from "@/const";
import { cookies } from "next/headers";

const getUserEmail = async () => {
  const user_email = cookies().get("user_email")?.value;
  return user_email;
};

export default async function getPlaceById(listingId) {
  try {
    const userEmail = await getUserEmail();

    const response = await axios.get(`${API_URL}/places/${listingId}`, {
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
