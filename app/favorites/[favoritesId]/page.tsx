import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import React from "react";
import FavoriteClient from "./FavoriteClient";
import { cookies } from "next/headers";
import getUserById from "@/app/actions/getUserById";
import getPlacesByWishlistId from "@/app/actions/getPlacesByWishlistId";
import getWishlistById from "@/app/actions/getWishlistById";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { FavoriteAPI, Pagination } from "@/models/api";
import { Wishlist } from "@/models/wishlist";

export const dynamic = "force-dynamic";

const FavoritePage = async ({ params, searchParams }: Pagination | any) => {
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

  if (!accessToken || !user || user?.role === 3) {
    unauthorized = true;
  } else {
    obj = await getPlacesByWishlistId({
      wish_list_id,
      page: searchParams.page || 1,
      limit: searchParams.limit || LIMIT,
    });
    wishlist = await getWishlistById(wish_list_id);

    if (!wishlist || !obj?.places) unauthorized = true;
  }

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
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

export default FavoritePage;
