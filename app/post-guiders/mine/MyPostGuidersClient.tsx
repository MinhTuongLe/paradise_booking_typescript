/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import qs from "query-string";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { API_URL, LIMIT, classNames, post_guider_types } from "@/const";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import useCheckAvailableModal from "../../../hook/useCheckAvailableModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { User } from "@/models/user";
import { Place } from "@/models/place";
import { RootState } from "@/store/store";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import useAddNewPostGuiderModal from "@/hook/useAddNewPostGuiderModal";
import { PostGuider } from "@/models/post";
import { PostGuiderType } from "@/enum";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import PaginationComponent from "@/components/PaginationComponent";
import { Pagination } from "@/models/api";

function MyPostGuidersClient({
  data,
  paging,
}: {
  data: PostGuider[] | undefined;
  paging: Pagination;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const { t } = useTranslation("translation", { i18n });
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const [id, setId] = useState<number>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addNewPostGuider = useAddNewPostGuiderModal();
  const [selected, setSelected] = useState<{
    name: string;
    value: PostGuiderType;
    image: any;
    description: string;
  } | null>(null);

  const onDelete = (id: number) => {
    setId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    setOpen(false);
    setIsLoading(true);
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const res = await axios.delete(
        getApiRoute(RouteKey.PostGuiderDetails, {
          postGuiderId: id,
        }),
        config
      );
      if (res.data.data) {
        toast.success(t("toast.delete-post-successfully"));
        router.refresh();
      } else toast.error(t("toast.delete-post-failed"));
    } catch (error) {
      toast.error(t("toast.delete-post-failed"));
    }
    setIsLoading(false);
  };

  // const onSubmit = useCallback(async () => {
  //   let updatedQuery = {};
  //   let currentQuery;

  //   if (params) {
  //     currentQuery = qs.parse(params.toString());
  //   }

  //   updatedQuery = {
  //     topic_id: selected?.value,
  //     ...currentQuery,
  //   };

  //   const url = qs.stringifyUrl(
  //     {
  //       url: "/post-guiders/mine",
  //       query: updatedQuery,
  //     },
  //     { skipNull: true }
  //   );

  //   router.push(url);
  // }, [router, params, selected]);

  useEffect(() => {
    let updatedQuery = {};
    let currentQuery;
    console.log("updatedQuery");
    console.log("selected: ", selected);

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    updatedQuery = {
      ...currentQuery,
      topic_id: selected?.value,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName || "/post-guiders/mine",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, params, selected]);

  const handleClear = () => {
    setSelected(null);
    const url = qs.stringifyUrl({
      url: pathName || "/post-guiders/mine",
      query: {},
    });
    router.push(url);
  };

  useEffect(() => {
    if (!addNewPostGuider.isOpen) {
      router.refresh();
    }
  }, [addNewPostGuider.isOpen]);

  if (!loggedUser) {
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
        content={t("post-guider-feature.post-guiders")}
      />
      <div className="mt-10 mb-6">
        <Heading
          title={t("post-guider-feature.post-guiders")}
          subtitle={t("post-guider-feature.list-of-your-post-guiders")}
          start
        />
      </div>
      <div className="flex items-start justify-between space-x-8">
        <div className="w-[25%] flex justify-start space-x-8">
          <div className="flex-1">
            <Listbox
              value={selected}
              onChange={(e) => {
                setSelected(e);
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {selected
                            ? t(`post-guider-types.${selected?.name}`)
                            : t("place-status.all")}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm review-horizontal">
                        {post_guider_types.map((type) => (
                          <Listbox.Option
                            key={type.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-rose-100" : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={type}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "ml-3 block truncate"
                                    )}
                                  >
                                    {t(`post-guider-types.${type.name}`)}
                                  </span>
                                </div>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active
                                        ? "text-gray-900"
                                        : "text-rose-500",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
          <div className="w-1/4 flex space-x-8">
            {/* <Button label={t("general.filter")} onClick={onSubmit} medium /> */}
            <Button
              outline={true}
              label={t("general.clear")}
              onClick={handleClear}
              medium
            />
          </div>
        </div>
        <div className="w-[25%] flex justify-between items-center space-x-8">
          <div className="flex-1"></div>
          <div className="w-1/3">
            <Button
              label={t("general.create-new")}
              onClick={() => addNewPostGuider.onOpen()}
              medium
            />
          </div>
        </div>
      </div>
      {!isLoading ? (
        data && data.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {data?.map((item: PostGuider) => {
                return (
                  <div key={item.id}>
                    <PostGuiderCardVertical
                      data={item}
                      mine={true}
                      handleDelete={() => onDelete(item.id)}
                    />
                  </div>
                );
              })}
            </div>
            {paging?.total && paging.total > (paging?.limit || LIMIT) && (
              <PaginationComponent
                page={Number(params?.get("page")) || 1}
                total={paging?.total || LIMIT}
                limit={paging?.limit || LIMIT}
              />
            )}
          </>
        ) : (
          <EmptyState showReset location="/post-guiders/mine" />
        )
      ) : (
        <Loader />
      )}
    </Container>
  );
}

export default MyPostGuidersClient;
