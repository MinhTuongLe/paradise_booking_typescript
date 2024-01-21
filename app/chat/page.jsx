import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import ChatClient from "./ChatClient";
import getUserById from "@/app/actions/getUserById";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ChatPage = async () => {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  if (!user) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ChatClient />
    </ClientOnly>
  );
};

export default ChatPage;
