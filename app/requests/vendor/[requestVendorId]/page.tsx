import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import getUserById from "@/app/actions/getUserById";
import { getUserName } from "@/utils/getUserInfo";
import { Role } from "@/enum";
import RequestVendorDetailsClient from "./RequestVendorDetailsClient";
import getVendorRequestByUserId from "@/app/actions/getVendorRequestByUserId";

export const dynamic = "force-dynamic";

const RequestVendorDetailsPage = async ({
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

  const currentVendorRequestData = await getVendorRequestByUserId(
    params.requestVendorId
  );

  return (
    <ClientOnly>
      <RequestVendorDetailsClient
        currentVendorRequestData={
          currentVendorRequestData?.status ? currentVendorRequestData : {}
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

  const currentVendorRequestData = await getVendorRequestByUserId(
    params.requestVendorId
  );

  return {
    title: `${lang === "vi" ? "Yêu cầu của " : "Request of "} ${
      currentVendorRequestData && currentVendorRequestData?.user
        ? getUserName(currentVendorRequestData.user)
        : lang === "vi"
        ? "người dùng"
        : "user"
    }`,
  };
}

export default RequestVendorDetailsPage;
