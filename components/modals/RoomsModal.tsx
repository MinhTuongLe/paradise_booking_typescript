/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import i18n from "@/i18n/i18n";
import useRoomsModal from "../../hook/useRoomsModal";
import Modal from "./Modal";
import ListingCard from "../listing/ListingCard";
import { API_URL, LIMIT } from "@/const";
import Loader from "../Loader";
import PaginationComponent from "../PaginationComponent";
import { User } from "@/models/user";
import { Place } from "@/models/place";
import { Pagination } from "@/models/api";
import { getUserName } from "@/utils/getUserInfo";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import PostGuiderCardVertical from "../post-guiders/PostGuiderCardVertical";
import { PostGuider } from "@/models/post";

interface RoomsModalProps {
  currentUser: User | undefined;
}

const initPaging: Pagination = {
  page: 1,
  limit: LIMIT,
  total: LIMIT,
};

const RoomsModal: React.FC<RoomsModalProps> = ({ currentUser }) => {
  const { t } = useTranslation("translation", { i18n });
  const roomsModal: any = useRoomsModal();
  const params = useParams();
  const searchParams = useSearchParams();

  const [places, setPlaces] = useState<{
    data: Place[] | PostGuider[];
    paging: Pagination;
  }>({ data: [], paging: initPaging });
  const [isLoading, setIsLoading] = useState(false);

  const getPlacesByVendorId = async () => {
    setIsLoading(true);
    let config: any = {
      params: {
        page: searchParams?.get("page") || 1,
        limit: searchParams?.get("limit") || LIMIT,
      },
    };

    const route =
      currentUser?.role === Role.Vendor
        ? getApiRoute(RouteKey.PlaceListByOwner, { vendor_id: params?.usersId })
        : currentUser?.role === Role.Guider
        ? getApiRoute(RouteKey.PostGuiderList)
        : null;

    if (!route) {
      return;
    }

    if (currentUser?.role === Role.Guider) {
      config = {
        ...config,
        params: {
          ...config.params,
          post_owner_id: currentUser?.id,
        },
      };
    }

    await axios
      .get(route, config)
      .then((response) => {
        if (currentUser?.role === Role.Vendor) setPlaces(response.data);
        else setPlaces(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (roomsModal.isOpen) getPlacesByVendorId();
  }, [params, roomsModal]);

  const bodyContent = (
    <>
      {!isLoading ? (
        <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-4 overflow-x-hidden p-8 pb-0">
          {places.data &&
            places.data.length > 0 &&
            places.data.map((item) => {
              return (
                <>
                  {currentUser && currentUser.role === Role.Vendor ? (
                    <ListingCard
                      key={item.id}
                      data={item as Place}
                      shrink={true}
                    />
                  ) : (
                    <div key={item.id}>
                      <PostGuiderCardVertical data={item as PostGuider} />
                    </div>
                  )}
                </>
              );
            })}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );

  const footerContent = (
    <>
      {!isLoading ? (
        <>
          {places.paging?.total &&
            places.paging.total > (places.paging?.limit || LIMIT) && (
              <PaginationComponent
                page={Number(searchParams?.get("page")) || 1}
                total={places.paging?.total || LIMIT}
                limit={places.paging?.limit || LIMIT}
              />
            )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );

  return (
    <Modal
      isOpen={roomsModal.isOpen}
      title={`${t(
        currentUser?.role === Role.Vendor
          ? "components.all-rooms-of"
          : "All post of"
      )} ${currentUser ? getUserName(currentUser) : "user"}`}
      onClose={roomsModal.onClose}
      body={bodyContent}
      footer={footerContent}
      classname="sm:w-full md:w-3/4 lg:w-2/3"
    />
  );
};

export default RoomsModal;
