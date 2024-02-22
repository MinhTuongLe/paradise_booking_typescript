import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import FavoritesClient from "./FavoritesClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getPlacesByWishlistId from "@/app/actions/getPlacesByWishlistId";
import getWishListByUserId from "@/app/actions/getWishListByUserId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { Wishlist } from "@/models/wishlist";

export const dynamic = "force-dynamic";

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
        <EmptyState title="Unauthorized" subtitle="Please login" />
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
