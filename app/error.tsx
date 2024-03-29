"use client";

import { useEffect } from "react";

import EmptyState from "@/components/EmptyState";

function ErrorState({ error }: any) {
  useEffect(() => {
    console.log("🚀 ~ file: error.tsx:12 ~ ErrorState ~ error:", error);
  }, [error]);

  return <EmptyState title="Uh Oh" subtitle="Something went wrong!" />;
}

export default ErrorState;
