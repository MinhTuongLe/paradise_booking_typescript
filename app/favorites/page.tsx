import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import FavoritesClient from "./FavoritesClient";
import getWishListByUserId from "@/app/actions/getWishListByUserId";
import { Wishlist } from "@/models/wishlist";
import getUserById from "../actions/getUserById";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Danh sách yêu thích của tôi" : "My Wishlists",
  };
}

const FavoritesPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);

  let unauthorized = false;

  let wishlists: Wishlist[] = [];

  if (!accessToken || !userId || user?.role === Role.Admin) {
    unauthorized = true;
  } else {
    wishlists = await getWishListByUserId(userId);
  }

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
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
