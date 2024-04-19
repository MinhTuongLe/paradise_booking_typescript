import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import PostReviewClient from "./PostReviewClient";
import getPostReviewById from "@/app/actions/getPostReviewsById";
import { PostReview } from "@/models/post";

export const dynamic = "force-dynamic";

const PostReviewPage = async () => {
  return (
    <ClientOnly>
      <PostReviewClient />
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { postReviewId: number | string };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  const postReviewData: PostReview | undefined = await getPostReviewById(
    params.postReviewId
  );

  return {
    title:
      postReviewData?.title ||
      (lang === "vi" ? "Chi tiết bài đăng" : "Post Reviews Details"),
  };
}

export default PostReviewPage;
