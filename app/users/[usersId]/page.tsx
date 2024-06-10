import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import UserClient from "./UserClient";
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
import getVendorRequestByUserId from "@/app/actions/getVendorRequestByUserId";

export const dynamic = "force-dynamic";

const UserPage = async ({
  params,
}: {
  params: { usersId: string | number };
}) => {
  const user: User | undefined = await getUserById(params?.usersId);

  if (!user) {
    return <EmptyState />;
  }

  let obj: PropertiesAPI | undefined = {
    places: [],
    post: [],
    paging: {
      page: 1,
      limit: LIMIT,
      total: 0,
    },
  };

  if (user?.role === Role.Vendor) {
    console.log("role vendor");
    obj = await getPlaceByVendorId({
      vendor_id: user?.id,
      page: 1,
      limit: LIMIT,
    });
  }

  if (user?.role === Role.Guider) {
    obj = await getPostGuidersByTopicId({
      page: 1,
      limit: LIMIT,
      post_owner_id: user.id,
      lat: null,
      lng: null,
      topic_id: null,
    });
  }

  const currentVendorRequestData = await getVendorRequestByUserId(user.id);
  const currentGuiderRequestData = await getGuiderRequestByUserId(user.id);
  // if (!accessToken && user.role !== Role.Vendor) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  return (
    <ClientOnly>
      <RoomsModal currentUser={user} />
      <UserClient
        places={obj?.places}
        post={obj?.post}
        currentUser={user}
        role={user?.role || Role.User}
        currentGuiderRequestData={
          currentGuiderRequestData?.status ? currentGuiderRequestData : {}
        }
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
  params: { usersId: number };
}): Promise<Metadata> {
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user: User | undefined = await getUserById(params?.usersId);

  return {
    title:
      Number(userId) === user?.id
        ? lang === "vi"
          ? "Hồ sơ của tôi"
          : "My Profile"
        : `${lang === "vi" ? "Hồ sơ" : "Profile"}: ${
            user ? getUserName(user) : "-"
          }`,
  };
}

export default UserPage;
