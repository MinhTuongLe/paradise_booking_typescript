import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import UserClient from "./UserClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getPlaceByVendorId from "@/app/actions/getPlaceByVendorId";
import RoomsModal from "@/components/models/RoomsModal";
import { LIMIT } from "@/const";
import { FavoriteAPI } from "@/models/api";
import { User } from "@/models/user";

export const dynamic = "force-dynamic";

const UserPage = async ({ params }: { params: any }) => {
  // const accessToken = cookies().get("accessToken")?.value;

  const user:User = await getUserById(params?.usersId);

  let obj:FavoriteAPI | undefined = {
    places: [],
    paging: {
      page: 1,
      limit: LIMIT,
      total: 0,
    },
  };

  if (user.role === 2)
    obj = await getPlaceByVendorId({
      vendor_id: user?.id,
      page: 1,
      limit: LIMIT,
    });

  // if (!accessToken && user.role !== 2) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }

  return (
    <ClientOnly>
      <RoomsModal currentUser={user} />
      <UserClient places={obj?.places} currentUser={user} role={user.role} />
    </ClientOnly>
  );
};

export default UserPage;
