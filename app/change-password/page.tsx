import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ChangePasswordClient from "./ChangePasswordClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ChangePasswordPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <ClientOnly>
      <ChangePasswordClient />
    </ClientOnly>
  );
};

export default ChangePasswordPage;
