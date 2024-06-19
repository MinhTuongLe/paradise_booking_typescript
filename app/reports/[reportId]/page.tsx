import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";
import ReportDetailsClient from "./ReportDetailsClient";
import getReportById from "@/app/actions/getReportById";

export const dynamic = "force-dynamic";

const RequestGuiderDetailsPage = async ({
  params,
}: {
  params: { reportId: string | number };
}) => {
  let unauthorized = false;
  const accessToken = cookies().get("accessToken")?.value;
  const lang = cookies().get("lang")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  if (!accessToken || !userId || !user || user?.role !== Role.Admin)
    unauthorized = true;

  if (unauthorized) {
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );
  }

  const currentReportData = await getReportById(params.reportId);

  return (
    <ClientOnly>
      <ReportDetailsClient reportData={currentReportData} />
    </ClientOnly>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;
  return {
    title: `${lang === "vi" ? "Báo cáo chi tiết" : "Report details"}`,
  };
}

export default RequestGuiderDetailsPage;
