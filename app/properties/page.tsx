import { cookies } from "next/headers";
import type { Metadata } from "next";
import ClientOnly from "@/components/ClientOnly";

import EmptyState from "@/components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";
import { getRoleId } from "@/utils/getUserInfo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Địa điểm của tôi" : "My Properties",
  };
}

const PropertiesPage = async () => {
  let unauthorized = false;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  if (!userId) unauthorized = true;
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) unauthorized = true;

  const user = await getUserById(userId);
  if (user?.role !== getRoleId(Role.Vendor)) unauthorized = true;

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
        />
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
