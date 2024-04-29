import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import { PostGuider } from "@/models/post";
import PostGuiderClient from "@/components/PostGuiderClient";
import getPostGuiderById from "@/app/actions/getPostGuiderById";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

const PostGuiderPage = async ({
  params,
}: {
  params: { postGuiderId: number | string };
}) => {
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.postGuiderId
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
      <PostGuiderClient data={postGuiderData} />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { postGuiderId: number | string };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const postGuiderData: PostGuider | undefined = await getPostGuiderById(
    params.postGuiderId
  );

  return {
    title:
      postGuiderData?.title ||
      (lang === "vi" ? "Chi tiết bài đăng" : "Post Guider Details"),
  };
}

export default PostGuiderPage;
