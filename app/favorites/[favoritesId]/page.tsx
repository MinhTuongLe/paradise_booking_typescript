import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import FavoriteClient from "./FavoriteClient";
import getUserById from "@/app/actions/getUserById";
import getPlacesByWishlistId from "@/app/actions/getPlacesByWishlistId";
import getWishlistById from "@/app/actions/getWishlistById";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { FavoriteAPI, Pagination } from "@/models/api";
import { Wishlist } from "@/models/wishlist";
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export interface FavoritePageProps {
  params?: { favoritesId?: string | number };
  searchParams?: Pagination;
}

const FavoritePage = async ({ params, searchParams }: FavoritePageProps) => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);
  const wish_list_id = params?.favoritesId;
  let obj: FavoriteAPI | undefined = {
    places: [],
    paging: {
      page: 1,
      limit: LIMIT,
      total: 0,
    },
  };
  let wishlist: Wishlist = {};
  let unauthorized = false;

  if (!accessToken || !user || user?.role === getRoleId(Role.Admin)) {
    unauthorized = true;
  } else {
    obj = await getPlacesByWishlistId({
      wish_list_id,
      page: searchParams?.page || 1,
      limit: searchParams?.limit || LIMIT,
    });
    wishlist = await getWishlistById(wish_list_id);

    if (!wishlist || !obj?.places) unauthorized = true;
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
  } else if (obj?.places?.length === 0)
    return (
      <ClientOnly>
        <EmptyState
          title="Start create your Wishlist"
          subtitle="During your search, click the heart icon to save the properties and Experiences you like to your Wishlist."
        />
      </ClientOnly>
    );

  return (
    <ClientOnly>
      <FavoriteClient listings={obj?.places} wishlist={wishlist} />
      {obj && obj.paging?.total > (obj.paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={obj.paging?.total || LIMIT}
          limit={obj.paging?.limit || LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { favoritesId: number };
}): Promise<Metadata> {
  const wishlist: Wishlist = await getWishlistById(params.favoritesId);
  return {
    title: `Wishlist: ${wishlist?.title || wishlist?.Title || "-"}`,
  };
}

export default FavoritePage;
