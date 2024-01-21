import axios from "axios";
import { API_URL } from "@/const";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getUserById(userId) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = response.data.data;

    return user;
  } catch (error) {
    console.log("Something went wrong");
  }
}
