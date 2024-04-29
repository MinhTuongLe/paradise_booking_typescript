import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import { PostGuider } from "@/models/post";
import getPostGuiderById from "@/app/actions/getPostGuiderById";
import EmptyState from "@/components/EmptyState";
import MyPostGuiderClient from "./MyPostGuiderClient";

export const dynamic = "force-dynamic";

const MyPostGuiderPage = async ({
  params,
}: {
  params: { myPostGuiderId: number | string };
}) => {
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.myPostGuiderId
  );

  if (!postGuiderData) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <MyPostGuiderClient data={postGuiderData} postGuiderId={params.myPostGuiderId}/>
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { myPostGuiderId: number | string };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.myPostGuiderId
  );

  return {
    title:
      postGuiderData?.title ||
      (lang === "vi" ? "Chi tiết bài đăng" : "Post Guider Details"),
  };
}

export default MyPostGuiderPage;
