"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import EmptyState from "@/components/EmptyState";

function ErrorState({ error }: any) {
  const { t } = useTranslation("translation", { i18n });
  useEffect(() => {
    console.log("🚀 ~ file: error.tsx:12 ~ ErrorState ~ error:", error);
  }, [error]);

  return (
    <EmptyState
      title={t("general.uh-oh")}
      subtitle={t("general.something-went-wrong")}
    />
  );
}

export default ErrorState;
