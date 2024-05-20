/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { API_URL } from "@/const";
import ListingCard from "@/components/listing/ListingCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { Place } from "@/models/place";
import { Wishlist } from "@/models/wishlist";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

export interface FavoriteClientProps {
  listings: Place[];
  wishlist: Wishlist;
}

const FavoriteClient: React.FC<FavoriteClientProps> = ({
  listings,
  wishlist,
}) => {
  const { t } = useTranslation("translation", { i18n });

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
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
      .delete(
        getApiRoute(RouteKey.DeleteWishlistPlace, {
          listingId: item,
          wishlistId: wishlist.id,
        }),
        config
      )
      .then(() => {
        router.refresh();
        toast.success(t("toast.delete-place-successfully"));
      })
      .catch(() => {
        toast.error(t("toast.delete-place-failed"));
      })
      .finally(() => setIsLoading(false));
  };

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
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        content={t("general.place")}
      />
      <div className="mt-10">
        <Heading
          title={wishlist?.Title || t("wishlist-feature.your-wishlist")}
          subtitle={t("wishlist-feature.list-of-places-in-your-wishlist")}
          start
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
                actionLabel={t("wishlist-feature.delete-place")}
                currentUser={loggedUser || undefined}
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
