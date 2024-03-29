/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import useRoomsModal from "../../hook/useRoomsModal";
import Modal from "./Modal";
import ListingCard from "../listing/ListingCard";
import { useParams, useSearchParams } from "next/navigation";
import { API_URL, LIMIT } from "@/const";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import PaginationComponent from "../PaginationComponent";
import { toast } from "react-toastify";
import { User } from "@/models/user";
import { Place } from "@/models/place";
import { Pagination } from "@/models/api";

interface RoomsModalProps {
  currentUser: User | undefined;
}

const initPaging: Pagination = {
  page: 1,
  limit: LIMIT,
  total: LIMIT,
};

const RoomsModal: React.FC<RoomsModalProps> = ({ currentUser }) => {
  const roomsModal: any = useRoomsModal();
  const params = useParams();
  const searchParams = useSearchParams();

  const [places, setPlaces] = useState<{
    data: Place[];
    paging: Pagination;
  }>({ data: [], paging: initPaging });
  const [isLoading, setIsLoading] = useState(false);

  const getPlacesByVendorId = async () => {
    setIsLoading(true);
    const config = {
      params: {
        page: searchParams?.get("page") || 1,
        limit: searchParams?.get("limit") || LIMIT,
      },
    };

    await axios
      .get(`${API_URL}/places/owner/${params?.usersId}`, config)
      .then((response) => {
        setPlaces(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
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
            places.data.map((list) => {
              return <ListingCard key={list.id} data={list} shrink={true} />;
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
      title={`All Rooms of ${
        currentUser?.full_name || currentUser?.username || "Vendor"
      }`}
      onClose={roomsModal.onClose}
      body={bodyContent}
      footer={footerContent}
      classname="sm:w-full md:w-3/4 lg:w-2/3"
    />
  );
};

export default RoomsModal;
