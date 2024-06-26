/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import qs from "query-string";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { User } from "@/models/user";
import { Place } from "@/models/place";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PropertiesFilterDataSubmit } from "@/models/api";
import Input from "@/components/inputs/Input";
import { useForm } from "react-hook-form";

interface PropertiesClientProps {
  currentUser: User | undefined;
  places: Place[];
}

function PropertiesClient({ currentUser, places }: PropertiesClientProps) {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const { t } = useTranslation("translation", { i18n });
  const accessToken = Cookie.get("accessToken");
  const params = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const [id, setId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      place_id: "",
      date_from: "",
      date_to: "",
    },
    mode: "all",
  });

  const onDelete = (id: number) => {
    setId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    setOpen(false);
    const config = {
      params: {
        id: id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const res = await axios.delete(getApiRoute(RouteKey.Places), config);

      if (res.data.data) {
        toast.success(t("toast.delete-place-successfully"));
        router.refresh();
      } else toast.error(t("toast.delete-place-failed"));
    } catch (error) {
      toast.error(t("toast.delete-place-failed"));
    }
  };

  const getPlacesFiltered = async (dataFilter: PropertiesFilterDataSubmit) => {
    const { date_from, date_to } = dataFilter;

    let updatedQuery = {};
    let currentQuery;

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      place_id: searchValue ? searchValue : null,
      date_from,
      date_to,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName || "/properties",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const handleClearAllFilters = () => {
    reset();
    setSearchValue("");
    const url = qs.stringifyUrl({
      url: pathName || "/properties",
      query: {},
    });
    router.push(url);
  };

  if (
    !loggedUser ||
    !currentUser ||
    loggedUser?.id !== currentUser?.id ||
    loggedUser?.role !== Role.Vendor
  ) {
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
        content={t("general.property")}
      />
      <div className="mt-10 mb-6">
        <Heading
          title={t("property-feature.properties")}
          subtitle={t("property-feature.list-of-your-properties")}
          start
        />
      </div>
      <div className="flex items-center space-x-8 justify-between">
        <div className="flex items-center w-[70%] space-x-8">
          <div className="w-[20%]">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              {t("general.search")}
            </label>
            <div className="">
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                placeholder={t("property-feature.search-place-id")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-12 justify-center">
            <div className="flex space-x-4 items-center">
              <div className="font-bold text-[16px]">{t("general.from")}</div>
              <Input
                id="date_from"
                disabled={false}
                register={register}
                errors={errors}
                type="date"
                required
              />
            </div>
            <div className="flex space-x-4 items-center">
              <div className="font-bold text-[16px]">{t("general.to")}</div>
              <Input
                id="date_to"
                disabled={false}
                register={register}
                errors={errors}
                type="date"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-8">
          <div className="w-24">
            <Button
              disabled={false}
              label={t("general.search")}
              onClick={handleSubmit(getPlacesFiltered)}
              medium
            />
          </div>
          <div className="w-24">
            <Button
              outline={true}
              disabled={false}
              label={t("general.clear-all")}
              onClick={handleSubmit(handleClearAllFilters)}
              medium
            />
          </div>
        </div>
      </div>
      {places && places.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {places.map((listing) => (
              <ListingCard
                key={listing.id}
                data={listing}
                actionId={listing.id}
                onAction={onDelete}
                actionLabel={t("property-feature.delete-property")}
                currentUser={currentUser}
                shrink={true}
                disabled={listing?.is_booked}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={t("property-feature.no-properties-found")}
          subtitle={t("property-feature.empty-properties")}
        />
      )}
    </Container>
  );
}

export default PropertiesClient;
