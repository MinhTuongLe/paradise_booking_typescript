import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import MyPostReviewsClient from "./MyPostReviewsClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

const MyPostReviewsPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);

  if (!accessToken || !userId || user?.role === Role.Admin)
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );

  return (
    <ClientOnly>
      <MyPostReviewsClient />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Bài đăng của tôi" : "My Post Reviews",
  };
}

export default MyPostReviewsPage;
