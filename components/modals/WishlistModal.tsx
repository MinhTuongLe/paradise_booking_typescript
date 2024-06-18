/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useWishlistModal from "@/hook/useWishlistModal";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL, LIMIT } from "@/const";
import WishlistItem from "@/components/wishlist/WishlistItem";
import Loader from "../Loader";
import Button from "../Button";
import PaginationComponent from "../PaginationComponent";
import { WishlistModalType } from "@/models/modal";
import { Wishlist } from "@/models/wishlist";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const STEPS = {
  ADD_TO_WISHLIST: 0,
  CREATE_WISHLIST: 1,
};

function WishlistModal() {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const params = useSearchParams();
  const pathName = usePathname();

  const wishlistModal = useWishlistModal();
  const [step, setStep] = useState(STEPS.ADD_TO_WISHLIST);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const listingId = wishlistModal?.listingId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
    },
    mode: "all",
  });

  const onBack = () => {
    reset();
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const handleAdd = async (data: Wishlist) => {
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const submitValues = {
      place_id: listingId,
      wishlist_id: data.id,
    };

    await axios
      .post(getApiRoute(RouteKey.PlaceWishlists), submitValues, config)
      .then(() => {
        toast.success(
          `${t("toast.add-place-to-wishlist")} ${data.title} ${t(
            "general.successfully"
          )}`
        );
        wishlistModal.onClose();
        router.refresh();
      })
      .catch((err) => {
        toast.error(t("toast.this-place-is-now-in-this-wishlist"));
      })
      .finally(() => setIsLoading(false));
  };

  const onSubmit = async (data: WishlistModalType) => {
    if (step !== STEPS.CREATE_WISHLIST) {
      return onNext();
    }

    try {
      setIsLoading(true);
      const accessToken = Cookie.get("accessToken");
      const user_id = Cookie.get("userId");

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const submitValues = {
        ...data,
        user_id: Number(user_id),
      };

      await axios
        .post(getApiRoute(RouteKey.Wishlists), submitValues, config)
        .then(async (res) => {
          toast.success(t("toast.create-new-wishlist-successfully"));
          if (pathName === "/favorites") {
            setIsLoading(false);
            wishlistModal.onClose();
            router.refresh();
          }
          getWishListByUserId();
          onBack();

          // auto add listing to the only one wishlist
          if (wishlists.length === 0 && wishlistModal.listingId) {
            await handleAdd(res.data.data);
          }
        })
        .catch((err) => {
          toast.error(t("toast.create-new-wishlist-failed"));
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.CREATE_WISHLIST) {
      return t("general.create");
    }

    return t("components.create-new-wishlist");
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.CREATE_WISHLIST) {
      return t("general.cancel");
    }
    return undefined;
  }, [step]);

  const getWishListByUserId = async () => {
    setIsLoading(true);
    const user_id = Cookie.get("userId");
    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // params: {
      //   page: params.get("page") || 1,
      //   limit: params.get("limit") || LIMIT,
      // },
    };

    await axios
      .get(
        getApiRoute(RouteKey.WishlistsByUser, {
          userId: user_id,
        }),
        config
      )
      .then((response) => {
        setWishlists(response?.data.data || []);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (wishlistModal.isOpen) {
      if (!listingId) {
        setStep(STEPS.CREATE_WISHLIST);
        return;
      }
      setStep(STEPS.ADD_TO_WISHLIST);
      getWishListByUserId();
    }
  }, [wishlistModal.isOpen, params]);

  let bodyContent = (
    <>
      {!isLoading ? (
        <div className="space-y-6 flex flex-col justify-start items-start max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
          {wishlists && wishlists.length > 0 ? (
            <>
              {wishlists.map((item, index) => (
                <div className="w-full" key={index}>
                  <WishlistItem
                    data={{
                      id: item.id,
                      title: item.Title,
                    }}
                    listingId={listingId}
                    onActions={getWishListByUserId}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="text-[24px] font-bold">
              {t("components.empty-wishlist")}
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );

  if (step === STEPS.CREATE_WISHLIST) {
    bodyContent = (
      <div className="space-y-6">
        <div>
          <Input
            id="title"
            label={t("general.title")}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
        <hr />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={wishlistModal.isOpen}
      title={t("components.add-to-your-wishlist")}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={step === STEPS.ADD_TO_WISHLIST ? undefined : onBack}
      onClose={wishlistModal.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/3"
    />
  );
}

export default WishlistModal;
