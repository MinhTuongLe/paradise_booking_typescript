import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ChangePasswordClient from "./ChangePasswordClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Đổi mật khẩu" : "Change Password",
  };
}

const ChangePasswordPage = async () => {
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
      <ChangePasswordClient />
    </ClientOnly>
  );
};

export default ChangePasswordPage;
