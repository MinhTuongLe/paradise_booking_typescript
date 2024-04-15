import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import FavoritesClient from "./FavoritesClient";
import getWishListByUserId from "@/app/actions/getWishListByUserId";
import { Wishlist } from "@/models/wishlist";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Wishlists",
  };
}

const FavoritesPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;

  let unauthorized = false;

  let wishlists: Wishlist[] = [];

  if (!accessToken || !userId) {
    unauthorized = true;
  } else {
    wishlists = await getWishListByUserId(userId);
  }

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState
          title={t("general.unauthorized")}
          subtitle={t("general.please-login")}
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient wishlists={wishlists} />
    </ClientOnly>
  );
};

export default FavoritesPage;
