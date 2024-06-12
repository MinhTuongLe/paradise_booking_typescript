import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import getUserById from "@/app/actions/getUserById";
import { getUserName } from "@/utils/getUserInfo";
import { Role } from "@/enum";
import getGuiderRequestByUserId from "@/app/actions/getGuiderRequestByUserId";
import RequestGuiderDetailsClient from "./RequestGuiderDetailsClient";

export const dynamic = "force-dynamic";

const RequestGuiderDetailsPage = async ({
  params,
}: {
  params: { requestVendorId: string | number };
}) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  if (!accessToken || !userId || !user || user?.role !== Role.Admin)
    unauthorized = true;

  if (unauthorized) {
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );
  }

  const currentGuiderRequestData = await getGuiderRequestByUserId(
    params.requestVendorId
  );

  return (
    <ClientOnly>
      <RequestGuiderDetailsClient
        currentGuiderRequestData={
          currentGuiderRequestData?.status ? currentGuiderRequestData : {}
        }
      />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { requestVendorId: number };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  const currentGuiderRequestData = await getGuiderRequestByUserId(
    params.requestVendorId
  );

  return {
    title: `${lang === "vi" ? "Yêu cầu của " : "Request of "} ${
      currentGuiderRequestData && currentGuiderRequestData?.user
        ? getUserName(currentGuiderRequestData.user)
        : lang === "vi"
        ? "người dùng"
        : "user"
    }`,
  };
}

export default RequestGuiderDetailsPage;
