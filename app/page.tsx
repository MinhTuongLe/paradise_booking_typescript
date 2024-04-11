import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import getPlaces from "./actions/getPlaces";
import PaginationComponent from "@/components/PaginationComponent";
import { LIMIT} from "@/const";
import { Pagination } from "@/models/api";
import { Place } from "@/models/place";
import { cookies } from "next/headers";
import getUserById from "./actions/getUserById";
import { getRoleId } from "@/utils/getUserInfo";
import { Role } from "@/enum";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Pagination;
}) {
  const userId = cookies().get("userId")?.value;
  const user = await getUserById(userId);

  const resultPlaces: { places: Place[]; paging: Pagination } = await getPlaces(
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
      <Container>
        <div
          className={`${
            user?.role !== getRoleId(Role.Admin) ? "mt-12" : "mt-0"
          } pt-16 px-8 grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8 overflow-x-hidden`}
        >
          {places &&
            places.map((place: Place) => {
              return (
                <ListingCard
                  key={place.id}
                  data={place}
                  // currentUser={currentUser}
                />
              );
            })}
        </div>
        {paging?.total && paging.total > (paging?.limit || LIMIT) && (
          <PaginationComponent
            page={Number(searchParams?.page) || 1}
            total={paging?.total || LIMIT}
            limit={paging?.limit || LIMIT}
          />
        )}
      </Container>
    </ClientOnly>
  );
}
