import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import UserClient from "./UserClient";
import getUserById from "@/app/actions/getUserById";
import getPlaceByVendorId from "@/app/actions/getPlaceByVendorId";
import RoomsModal from "@/components/modals/RoomsModal";
import { LIMIT } from "@/const";
import { FavoriteAPI } from "@/models/api";
import { User } from "@/models/user";
import { getRoleId, getUserName } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

const UserPage = async ({
  params,
}: {
  params: { usersId: string | number };
}) => {
  // const accessToken = cookies().get("accessToken")?.value;

  const user: User | undefined = await getUserById(params?.usersId);

  let obj: FavoriteAPI | undefined = {
    places: [],
    paging: {
      page: 1,
      limit: LIMIT,
      total: 0,
    },
  };

  if (user?.role === getRoleId(Role.Vendor))
    obj = await getPlaceByVendorId({
      vendor_id: user?.id,
      page: 1,
      limit: LIMIT,
    });

  // if (!accessToken && user.role !== getRoleId(Role.Vendor)) {
  //   return <EmptyState title={t("general.unauthorized")} subtitle={t("general.please-login")} />;
  // }

  return (
    <ClientOnly>
      <RoomsModal currentUser={user} />
      <UserClient
        places={obj?.places}
        currentUser={user}
        role={user?.role || getRoleId(Role.User)}
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

  const user: User | undefined = await getUserById(params?.usersId);

  return {
    title:
      Number(userId) === user?.id
        ? "My Profile"
        : `Profile: ${user ? getUserName(user) : "-"}`,
  };
}

export default UserPage;
