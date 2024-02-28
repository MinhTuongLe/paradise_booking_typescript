/* eslint-disable react/no-unescaped-entities */
"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import React, { useState } from "react";
import WishlistCard from "@/components/listing/WishlistCard";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import useWishlistModal from "@/hook/useWishlistModal";
import { Wishlist } from "@/models/wishlist";
import { RootState } from "@/store/store";

function FavoritesClient({ wishlists }: { wishlists: Wishlist[] | [] }) {
  const wishlistModal = useWishlistModal();
  const loggedUser = useSelector((state: RootState) => state.authSlice.loggedUser);
  const authState = useSelector((state: RootState) => state.authSlice.authState);
  const [isLoading, setIsLoading] = useState(false);

  if (!authState || loggedUser?.role === 3) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <Container>
      <div className="mt-10 flex justify-between items-start">
        <Heading title="Your Wishlist" subtitle="List of your wishlist!" />
        {wishlists && wishlists?.length > 0 && (
          <div className="w-[120px]">
            <Button
              label="Create new"
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
                You don't have any wishlist to display
              </span>
              <div className="max-w-[160px]">
                <Button
                  label="Create a new one"
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
