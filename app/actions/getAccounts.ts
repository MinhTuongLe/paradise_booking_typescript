import axios from "axios";
import { cookies } from "next/headers";

import { SHRINK_LIMIT } from "@/const";
import { AccountAPI, Pagination } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const getAccessToken = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  return accessToken;
};

export default async function getAccounts({
  page,
  limit,
}: Pagination): Promise<AccountAPI | undefined> {
  try {
    const accessToken = await getAccessToken();

    const config = {
      params: {
        page: page ? page : 1,
        limit: limit ? limit : SHRINK_LIMIT,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(getApiRoute(RouteKey.Accounts), config);

    const accounts = response?.data?.data;
    const paging = response?.data?.paging;

    return { accounts, paging };
  } catch (error) {
    console.log("Something went wrong");
  }
}
