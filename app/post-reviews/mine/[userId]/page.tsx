import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostReviewsClient from "./MyPostReviewsClient";

export const dynamic = "force-dynamic";

const MyPostReviewsPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;

  if (!accessToken || !userId)
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );

  return (
    <ClientOnly>
      <MyPostReviewsClient />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My Post Reviews`,
  };
}

export default MyPostReviewsPage;
