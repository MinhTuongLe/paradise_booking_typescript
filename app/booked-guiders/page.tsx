import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import getUserById from "@/app/actions/getUserById";
import BookedGuidersClient from "./BookedGuidersClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Booked Guiders",
  };
}

const BookGuidersPage = async () => {
  return (
    <ClientOnly>
      <BookedGuidersClient />
    </ClientOnly>
  );
};

export default BookGuidersPage;
