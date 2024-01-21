import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import getUserById from "@/app/actions/getUserById";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PropertiesPage = async () => {
  let unauthorized = false;
  const userId = cookies().get("userId")?.value;
  if (!userId) unauthorized = true;
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) unauthorized = true;

  const user = await getUserById(userId);
  if (user?.role !== 2) unauthorized = true;

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient currentUser={user} />
    </ClientOnly>
  );
};

export default PropertiesPage;
