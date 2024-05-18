import type { Metadata } from "next";
import { cookies } from "next/headers";

import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PropertyClient from "./PropertyClient";
import getUserById from "@/app/actions/getUserById";
import getPlaceById from "@/app/actions/getPlaceById";
import getReservationByPlaceId from "@/app/actions/getReservationByPlaceId";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import { Pagination, ReservationsAPI } from "@/models/api";
import { Place } from "@/models/place";
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

const PropertyPage = async ({
  params,
  searchParams,
}: {
  params: { propertiesId: string | number };
  searchParams: Pagination;
}) => {
  const accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  const user = await getUserById(userId);

  if (
    !accessToken ||
    !userId ||
    !user ||
    user.role !== getRoleId(Role.Vendor)
  ) {
    return (
      <EmptyState
        title={lang === "vi" ? "Không được phép" : "Unauthorized"}
        subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
      />
    );
  }

  try {
    const placeData = await getPlaceById(params?.propertiesId);

    if (!placeData || !placeData.place) {
      return (
        <EmptyState
          title={lang === "vi" ? "Không tìm thấy địa điểm" : "Place not found"}
        />
      );
    }

    const { place } = placeData;

    const obj = await getReservationByPlaceId({
      placeId: params?.propertiesId,
      page: searchParams.page || 1,
      limit: searchParams.limit || LIMIT,
    });

    return (
      <ClientOnly>
        <PropertyClient place={place} reservations={obj?.reservations} />
        {obj && obj.paging?.total > (obj.paging?.limit || LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={obj?.paging?.total || LIMIT}
            limit={obj?.paging?.limit || LIMIT}
          />
        )}
      </ClientOnly>
    );
  } catch (error) {
    console.error("Error fetching place:", error);
    return (
      <EmptyState
        title={lang === "vi" ? "Lỗi" : "Error"}
        subtitle={lang === "vi" ? "Không có dữ liệu" : "Failed to get data"}
      />
    );
  }
};

export async function generateMetadata({
  params,
}: {
  params: { propertiesId: number };
}): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  const placeData = await getPlaceById(params?.propertiesId);
  return {
    title: placeData?.place.name
      ? placeData?.place.name
      : lang === "vi"
      ? "Tên địa điểm"
      : "Property Name",
  };
}

export default PropertyPage;
