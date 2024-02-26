import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ChangePasswordClient from "./ChangePasswordClient";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Change Password",
  };
}

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
