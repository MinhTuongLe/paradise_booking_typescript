import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostGuidersClient from "./MyPostGuidersClient";
import getUserById from "@/app/actions/getUserById";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Post Guiders",
  };
}

const MyPostGuidersPage = async () => {
  let unauthorized = false;
  const userId = cookies().get("userId")?.value;
  if (!userId) unauthorized = true;
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) unauthorized = true;

  const user = await getUserById(userId);
  // if (user?.role !== 2) unauthorized = true;

  // if (unauthorized) {
  //   return (
  //     <ClientOnly>
  //       <EmptyState title="Unauthorized" subtitle="Please login" />
  //     </ClientOnly>
  //   );
  // }

  return (
    <ClientOnly>
      <MyPostGuidersClient currentUser={user} />
    </ClientOnly>
  );
};

export default MyPostGuidersPage;
