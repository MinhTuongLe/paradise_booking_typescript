/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { differenceInDays, parse } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import useSearchModal from "@/hook/useSearchModal";
import SearchModal from "../modals/SearchModal";

function Search({}) {
  const searchModel = useSearchModal();
  const params = useSearchParams();
  const pathname = usePathname();

  const lat = params?.get("lat");
  const lng = params?.get("lng");
  const startDate = params?.get("date_from");
  const endDate = params?.get("date_to");
  const guest = params?.get("guest");
  const num_bed = params?.get("num_bed");
  const price_from = params?.get("price_from");
  const price_to = params?.get("price_to");

  const locationLabel = useMemo(() => {
    if (lat && lng) {
      return `(${lat}, ${lng})`;
    }

    return "Anywhere";
  }, [lat, lng, startDate, endDate, guest, num_bed, price_from, price_to]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = parse(startDate, "dd-MM-yyyy", new Date());
      const end = parse(endDate, "dd-MM-yyyy", new Date());
      let diff = differenceInDays(end, start);

      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Days`;
    }

    return "Any Week";
  }, [lat, lng, startDate, endDate, guest, num_bed, price_from, price_to]);

  const guessLabel = useMemo(() => {
    if (guest && num_bed) {
      return `${guest} Guests / ${num_bed} Beds`;
    }

    return "Guests / Beds";
  }, [lat, lng, startDate, endDate, guest, num_bed, price_from, price_to]);

  const priceRangeLabel = useMemo(() => {
    if (price_from && price_to) {
      return `${price_from}$ - ${price_to}$`;
    }

    return "Price Range";
  }, [lat, lng, startDate, endDate, guest, num_bed, price_from, price_to]);

  return (
    <>
      {pathname === "/" && (
        <div className="border-[1px] w-full rounded-full shadow-sm hover:shadow-md transition cursor-pointer relative">
          <div
            className={`rounded-[28px] flex flex-row items-center justify-between ${
              searchModel.isOpen ? "bg-slate-200" : "bg-white"
            }`}
          >
            <div
              className={`py-4 hover:bg-slate-300 hover:rounded-[28px] text-sm font-semibold px-6 whitespace-nowrap ${
                lat && lng ? "text-rose-500" : undefined
              } 
          ${
            searchModel.option === 1 && searchModel.isOpen
              ? "bg-white rounded-[28px]"
              : undefined
          }
          `}
              onClick={(e) => {
                e.stopPropagation();
                searchModel.onOpen(1);
              }}
            >
              {locationLabel}
            </div>
            <div
              className={`py-4 hidden sm:block text-sm font-semibold px-6 flex-1 text-center whitespace-nowrap hover:bg-slate-300 hover:rounded-[28px] ${
                startDate && endDate ? "text-rose-500" : undefined
              }
          ${
            searchModel.option === 2 && searchModel.isOpen
              ? "bg-white rounded-[28px]"
              : undefined
          }
          `}
              onClick={(e) => {
                e.stopPropagation();
                searchModel.onOpen(2);
              }}
            >
              {durationLabel}
            </div>
            <div
              className={`py-4 hover:bg-slate-300 hidden sm:inline-block text-sm font-semibold px-6 flex-1 text-center whitespace-nowrap hover:rounded-[28px] ${
                guest && num_bed ? "text-rose-500" : undefined
              }
          ${
            searchModel.option === 3 && searchModel.isOpen
              ? "bg-white rounded-[28px]"
              : undefined
          }
          `}
              onClick={(e) => {
                e.stopPropagation();
                searchModel.onOpen(3);
              }}
            >
              {guessLabel}
            </div>
            <div className="text-sm pr-2 flex flex-row items-center gap-3 whitespace-nowrap">
              <div
                className={`py-4 px-6 hover:bg-slate-300 hidden sm:block text-center font-semibold hover:rounded-[28px] ${
                  price_from && price_to ? "text-rose-500" : undefined
                }
            ${
              searchModel.option === 4 && searchModel.isOpen
                ? "bg-white rounded-[28px]"
                : undefined
            }
            `}
                onClick={(e) => {
                  e.stopPropagation();
                  searchModel.onOpen(4);
                }}
              >
                {priceRangeLabel}
              </div>
              <div
                className={`ml-2 p-2 bg-rose-500 rounded-full text-white flex items-center justify-between transition-all duration-300 ease-in-out`}
              >
                <BiSearch size={16} />
                {searchModel.isOpen && (
                  <motion.div
                    initial={{
                      width: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 1 }}
                    whileInView={{ opacity: 1, width: "100%" }}
                    className="ml-2"
                  >
                    Search
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`mt-2 absolute top-full left-1/2 transform -translate-x-1/2 bg-white ${
              searchModel.option === 2 ? "w-[50vw]" : "w-[30vw]"
            }  rounded-xl`}
          >
            <SearchModal />
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
