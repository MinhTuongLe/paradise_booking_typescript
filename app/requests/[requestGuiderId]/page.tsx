import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import UserClient from "./RequestGuiderDetailsClient";
import getUserById from "@/app/actions/getUserById";
import getPlaceByVendorId from "@/app/actions/getPlaceByVendorId";
import RoomsModal from "@/components/modals/RoomsModal";
import { LIMIT } from "@/const";
import { FavoriteAPI, Pagination, PropertiesAPI } from "@/models/api";
import { User } from "@/models/user";
import { getUserName } from "@/utils/getUserInfo";
import { Role } from "@/enum";
import getPostGuidersByTopicId from "@/app/actions/getPostGuidersByTopicId";
import { PostGuider } from "@/models/post";
import getGuiderRequestByUserId from "@/app/actions/getGuiderRequestByUserId";
import RequestGuiderDetailsClient from "./RequestGuiderDetailsClient";

export const dynamic = "force-dynamic";

const RequestGuiderDetailsPage = async ({
  params,
}: {
  params: { requestGuiderId: string | number };
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

  const currentGuiderRequestData = await getGuiderRequestByUserId(params.requestGuiderId)

  // if (!accessToken && user.role !== Role.Vendor) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  return (
    <ClientOnly>
      <RequestGuiderDetailsClient
        currentGuiderRequestData={currentGuiderRequestData?.status ? currentGuiderRequestData : {}}
      />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { usersId: number };
}): Promise<Metadata> {
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  return {
    title: 'Yêu cầu của User'
      // Number(userId) === 0
      //   ? lang === "vi"
      //     ? "Yêu cầu"
      //     : "Request"
      //   : `${lang === "vi" ? "Yêu cầu" : "Request"}: ${
      //       '' ? getUserName('') : "-"
      //     }`,
  };
}

export default RequestGuiderDetailsPage;
