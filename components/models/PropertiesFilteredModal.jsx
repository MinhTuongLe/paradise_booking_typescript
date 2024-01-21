/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import useCheckAvailableModal from "../../hook/useCheckAvailableModal";
import Modal from "./Modal";
import ListingCard from "../listing/ListingCard";
import { useParams, useSearchParams } from "next/navigation";
import { API_URL, LIMIT } from "@/const";
import axios from "axios";
import Cookie from "js-cookie";
import { useState, useCallback } from "react";
import Loader from "../Loader";
import PaginationComponent from "../PaginationComponent";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Input from "../inputs/Input";
import Button from "../Button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const columns = [
  { name: "Booking", uid: "booking_id" },
  { name: "From", uid: "date_from" },
  { name: "To", uid: "date_to" },
];

function PropertiesFilteredModal() {
  const checkAvailableModal = useCheckAvailableModal();
  const params = useParams();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      place_id: "",
      date_from: "",
      date_to: "",
    },
  });

  const getPlacesFiltered = async (dataFilter) => {
    setIsLoading(true);
    const { place_id, date_from, date_to } = dataFilter;
    const config = {
      params: {
        place_id,
        date_from,
        date_to,
      },
    };

    await axios
      .get(`${API_URL}/places/status_booking`, config)
      .then((response) => {
        setProperty(response?.data?.data);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFilter = async (data) => {
    const submitValues = {
      ...data,
      place_id: searchValue ? searchValue : 0,
      date_from: data.date_from.split("-").reverse().join("-"),
      date_to: data.date_to.split("-").reverse().join("-"),
    };
    const dateFrom = new Date(data.date_from);
    const dateTo = new Date(data.date_to);

    if (dateFrom > dateTo) {
      toast.error("From Date must be before To Date");
      return;
    }

    getPlacesFiltered(submitValues);
  };

  const handleClearAllFilters = () => {
    reset();
    setSearchValue("");
    setProperty(null);
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      default:
        return cellValue || "-";
    }
  }, []);

  const bodyContent = (
    <>
      <div className="flex items-center space-x-8 justify-between">
        <div className="w-[30%]">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="">
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder="Search Place ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-12 justify-center">
          <div className="flex space-x-4 items-center">
            <div className="font-bold text-[16px]">From</div>
            <Input
              id="date_from"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="date"
              required
            />
          </div>
          <div className="flex space-x-4 items-center">
            <div className="font-bold text-[16px]">To</div>
            <Input
              id="date_to"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="date"
              required
            />
          </div>
        </div>
        <div className="flex space-x-8">
          <div className="w-24">
            <Button
              disabled={isLoading}
              label="Search"
              onClick={handleSubmit(handleFilter)}
              medium
            />
          </div>
          <div className="w-24">
            <Button
              outline={true}
              disabled={isLoading}
              label="Clear All"
              onClick={handleSubmit(handleClearAllFilters)}
              medium
            />
          </div>
        </div>
      </div>
      {!isLoading ? (
        property ? (
          <div className="mt-8">
            <div className="flex space-x-12">
              <div className="space-x-2">
                <span className="text-xl font-bold">Original:</span>
                <span>{property?.num_place_original || 0} (rooms)</span>
              </div>
              <div className="space-x-2">
                <span className="text-xl font-bold">Booked:</span>
                <span>{property?.num_place_booked || 0} (rooms)</span>
              </div>
              <div className="space-x-2">
                <span className="text-xl font-bold">Remain:</span>
                <span>{property?.num_place_remain || 0} (rooms)</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-xl font-bold">Booking History</div>
              <Table aria-label="Booking History">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      className="text-left bg-slate-200 px-3 py-3"
                      key={column.uid}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  emptyContent={<div className="mt-4">No data to display.</div>}
                >
                  {property?.booking_place_history?.map((item, index) => (
                    <TableRow key={index}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-[32px] font-bold mt-12 text-center pb-48">
            Enter data to filter
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );

  const footerContent = (
    <>
      {/* {places.paging?.total > (places.paging?.limit || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams.get("page")) || 1}
          total={searchParams.paging?.total || LIMIT}
          limit={searchParams.paging?.limit || LIMIT}
        />
      )} */}
    </>
  );

  return (
    <Modal
      isOpen={checkAvailableModal.isOpen}
      title="Properties Filter By Date Range"
      onClose={checkAvailableModal.onClose}
      body={bodyContent}
      footer={footerContent}
      classname="sm:w-full md:w-3/4 lg:w-2/3"
    />
  );
}

export default PropertiesFilteredModal;
