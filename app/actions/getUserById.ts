import axios from "axios";
import { API_URL } from "@/const";
import { cookies } from "next/headers";
import { User } from "@/models/user";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getUserById(
  userId: number | string | undefined
): Promise<User | undefined> {
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
