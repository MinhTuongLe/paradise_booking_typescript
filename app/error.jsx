"use client";

import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";

function ErrorState({ error }) {
  useEffect(() => {
    console.log("🚀 ~ file: error.tsx:12 ~ ErrorState ~ error:", error);
  }, [error]);

  return <EmptyState title="Uh Oh" subtitle="Something went wrong!" />;
}

export default ErrorState;
