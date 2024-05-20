/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import WishlistCard from "@/components/wishlist/WishlistCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import useWishlistModal from "@/hook/useWishlistModal";
import { Wishlist } from "@/models/wishlist";
import { RootState } from "@/store/store";
import { Role } from "@/enum";

function FavoritesClient({ wishlists }: { wishlists: Wishlist[] | [] }) {
  const wishlistModal = useWishlistModal();
  const { t } = useTranslation("translation", { i18n });

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!authState || loggedUser?.role === Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <Container>
      <div className="mt-10 flex justify-between items-start">
        <Heading
          title={t("wishlist-feature.your-wishlist")}
          subtitle={t("wishlist-feature.list-of-your-wishlist")}
          start
        />
        {wishlists && wishlists?.length > 0 && (
          <div className="w-[120px]">
            <Button
              label={t("general.create-new")}
              onClick={() => wishlistModal.onOpen(undefined)}
            />
          </div>
        )}
      </div>
      {!isLoading ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {wishlists && wishlists?.length > 0 ? (
            wishlists.map((wishlist: Wishlist) => (
              <div key={wishlist.id}>
                <WishlistCard
                  data={{
                    id: wishlist.id,
                    title: wishlist.Title,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="space-y-4">
              <span className="text-[24px] font-bold whitespace-nowrap">
                {t("wishlist-feature.no-wishlist-to-display")}
              </span>
              <div className="max-w-[160px]">
                <Button
                  label={t("wishlist-feature.create-a-new-one")}
                  onClick={() => wishlistModal.onOpen(undefined)}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </Container>
  );
}

export default FavoritesClient;
