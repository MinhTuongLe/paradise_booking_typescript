/* eslint-disable react/no-unescaped-entities */
"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, { useState, Fragment, useRef, useEffect } from "react";
import { API_URL } from "@/const";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import ListingCard from "@/components/listing/ListingCard";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { Place } from "@/models/place";
import { Wishlist } from "@/models/wishlist";

export interface FavoriteClientProps {
  listings: Place[];
  wishlist: Wishlist;
}

const FavoriteClient: React.FC<FavoriteClientProps> = ({
  listings,
  wishlist,
}) => {
  const loggedUser = useSelector((state: any) => state.authSlice.loggedUser);
  const authState = useSelector((state: any) => state.authSlice.authState);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState<Wishlist>();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onDelete = (item: Wishlist) => {
    if (item) {
      setItem(item);
      setOpen(true);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setOpen(false);
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .delete(`${API_URL}/place_wish_lists/${item}/${wishlist.id}`, config)
      .then(() => {
        router.refresh();
        toast.success(`Delete place successfully`);
      })
      .catch(() => {
        toast.error("Delete place failed");
      })
      .finally(() => setIsLoading(false));
  };

  if (!authState || loggedUser.role === 3) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <Container>
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        content="place"
      />
      <div className="mt-10">
        <Heading
          title={wishlist?.Title || "Your Wishlist"}
          subtitle="List of places in your wishlist!"
        />
      </div>
      {!isLoading ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {listings &&
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                data={listing}
                actionId={listing.id}
                onAction={onDelete}
                actionLabel="Delete place"
                currentUser={loggedUser}
                shrink={true}
              />
            ))}
        </div>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default FavoriteClient;
