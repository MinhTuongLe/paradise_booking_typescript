import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import AssistantClient from "./AssistantClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Trợ lý ảo" : "Assistant",
  };
}

const AssistantPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;

  if (!accessToken) {
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );
  }

  return (
    <ClientOnly>
      <AssistantClient />
    </ClientOnly>
  );
};

export default AssistantPage;
