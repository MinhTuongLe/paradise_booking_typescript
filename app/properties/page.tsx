import { cookies } from "next/headers";
import type { Metadata } from "next";
import ClientOnly from "@/components/ClientOnly";

import EmptyState from "@/components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import getUserById from "@/app/actions/getUserById";
import { Role } from "@/enum";
import { Place } from "@/models/place";
import { Pagination } from "@/models/api";
import { LIMIT } from "@/const";
import PaginationComponent from "@/components/PaginationComponent";
import getPlacesByVendorId from "../actions/getPlacesByVendorId";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = cookies().get("lang")?.value;

  return {
    title: lang === "vi" ? "Địa điểm của tôi" : "My Properties",
  };
}

const PropertiesPage = async ({
  searchParams,
}: {
  searchParams: Pagination;
}) => {
  let unauthorized = false;
  const userId = cookies().get("userId")?.value;
  const lang = cookies().get("lang")?.value;

  if (!userId) unauthorized = true;
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) unauthorized = true;

  const user = await getUserById(userId);
  if (user?.role !== Role.Vendor) unauthorized = true;

  if (unauthorized) {
    return (
      <ClientOnly>
        <EmptyState
          title={lang === "vi" ? "Không được phép" : "Unauthorized"}
          subtitle={lang === "vi" ? "Vui lòng đăng nhập" : "Please login"}
        />
      </ClientOnly>
    );
  }

  const resultPlaces: { places: Place[]; paging: Pagination } =
    await getPlacesByVendorId(
      searchParams || {
        page: 1,
        limit: LIMIT,
      }
    );
  const { places, paging } = resultPlaces;

  if (!places || places?.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient currentUser={user} places={places} />
      {Number(paging?.total ?? 0) > (Number(paging?.limit) || LIMIT) && (
        <PaginationComponent
          page={Number(searchParams?.page) || 1}
          total={paging?.total || LIMIT}
          limit={paging?.limit || LIMIT}
        />
      )}
    </ClientOnly>
  );
};

export default PropertiesPage;
