/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import { emptyAvatar, formatDateType } from "@/const";
import { Vendor } from "@/models/user";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { BecomeGuiderStatus, RequestGuiderType, Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import EmptyState from "@/components/EmptyState";

export interface UserClientProps {
  currentVendorRequestData: Vendor | {};
}

const RequestVendorDetailsClient: React.FC<UserClientProps> = ({
  currentVendorRequestData,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);

  const { register, getValues } = useForm({
    defaultValues: {
      username: (currentVendorRequestData as Vendor)?.user?.username || "",
      full_name: (currentVendorRequestData as Vendor)?.user?.full_name || "",
      avatar: (currentVendorRequestData as Vendor)?.user?.avatar || "",
      address: (currentVendorRequestData as Vendor)?.user?.address || "",
      phone: (currentVendorRequestData as Vendor)?.user?.phone || "",
      dob: (currentVendorRequestData as Vendor)?.user?.dob || "",
      bio: (currentVendorRequestData as Vendor)?.user?.bio || "",
      email: (currentVendorRequestData as Vendor)?.user?.email || "",
    },
    mode: "all",
  });

  const [bio, setBio] = useState(getValues("bio"));

  const { register: register2 } = useForm({
    defaultValues: {
      full_name: (currentVendorRequestData as Vendor).full_name || "",
      username: (currentVendorRequestData as Vendor).username || "",
      phone: (currentVendorRequestData as Vendor).phone || "",
      dob: (currentVendorRequestData as Vendor).dob
        ? dayjs((currentVendorRequestData as Vendor).dob).format(
            formatDateType.YDM
          )
        : "",
      address: (currentVendorRequestData as Vendor).address || "",
      email: (currentVendorRequestData as Vendor).email || "",
      experience: (currentVendorRequestData as Vendor).experience || "",
      description: (currentVendorRequestData as Vendor).description || "",
      user_id: (currentVendorRequestData as Vendor).user_id || loggedUser?.id,
    },
    mode: "all",
  });

  // handle vendor request
  const handleVendorRequest = () => {
    setIsLoading(true);
    if (
      !loggedUser ||
      !currentVendorRequestData ||
      isEmpty(currentVendorRequestData)
    )
      return;

    const accessToken = Cookie.get("accessToken");
    const type =
      (currentVendorRequestData as Vendor).status &&
      (currentVendorRequestData as Vendor).status !== BecomeGuiderStatus.Success
        ? RequestGuiderType.Accept
        : RequestGuiderType.Reject;
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        request_vendor_id: (currentVendorRequestData as Vendor).id,
        type,
      },
    };
    axios
      .post(getApiRoute(RouteKey.ConfirmRequestVendor), null, config)
      .then(() => {
        toast.success(
          type === RequestGuiderType.Accept
            ? t("toast.accepted-vendor-request")
            : t("toast.rejected-vendor-request")
        );
        router.refresh();
      })
      .catch((err) => {
        console.log("err: ", err);
        // toast.error("Something Went Wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!authState || loggedUser?.role !== Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="sm:col-span-12 xl:col-span-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-start justify-between space-x-8">
            <div className="p-4 rounded-[24px] flex flex-col items-center justify-center shadow-2xl mb-4">
              <>
                <Image
                  width={200}
                  height={200}
                  src={
                    currentVendorRequestData &&
                    !isEmpty(currentVendorRequestData)
                      ? (currentVendorRequestData as Vendor)?.user?.avt
                      : emptyAvatar
                  }
                  alt="Avatar"
                  className="rounded-full h-[200px] w-[200px]"
                />
              </>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold my-3">
                {t("request-feature.bio")}
              </h1>
              <textarea
                className="resize-none border border-solid p-4 rounded-[24px] w-full focus:outline-none"
                rows={5}
                value={bio || "-"}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Xem hồ sơ cá nhân */}
          <div className="space-y-4">
            <Input
              id="full_name"
              label={t("general.fullname")}
              disabled={true}
              register={register}
            />
            <Input
              id="username"
              label={t("general.username")}
              disabled={true}
              register={register}
            />
            <Input
              id="phone"
              label={t("general.phone")}
              disabled={true}
              register={register}
              type="tel"
            />
            <Input
              id="dob"
              label={t("general.dob")}
              disabled={true}
              register={register}
              type="date"
              dob={true}
            />
            <Input
              id="address"
              label={t("general.address")}
              disabled={true}
              register={register}
            />
          </div>
        </div>
        <div className="sm:col-span-12 lg:col-span-6">
          <div className="px-8 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">
              {t("request-feature.vendor-form")}
            </h1>

            {/* Form Hướng dẫn viên */}
            <>
              <h1 className="text-2xl font-bold my-3"></h1>
              <Input
                id="full_name"
                label={t("general.fullname")}
                disabled={true}
                register={register2}
                required
              />
              <Input
                id="username"
                label={t("general.username")}
                disabled={true}
                register={register2}
                required
              />
              <Input
                id="email"
                label="E-mail"
                disabled={true}
                register={register2}
                required
                type="email"
              />
              <Input
                id="phone"
                label={t("general.phone")}
                disabled={true}
                register={register2}
                type="tel"
                required
              />
              <Input
                id="dob"
                label={t("general.dob")}
                disabled={true}
                register={register2}
                type="date"
                required
              />
              <Input
                id="address"
                label={t("general.address")}
                disabled={true}
                register={register2}
              />
              <Input
                id="description"
                label={t("general.description")}
                disabled={true}
                register={register2}
              />
              <Input
                id="experience"
                label={t("request-feature.show-experience")}
                disabled={true}
                register={register2}
                required
              />
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <Button
                    outline
                    label={t("general.cancel")}
                    onClick={() => router.push(`/requests`)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-6">
                  <Button
                    disabled={isLoading}
                    label={
                      currentVendorRequestData &&
                      (currentVendorRequestData as Vendor).status &&
                      (currentVendorRequestData as Vendor).status !==
                        BecomeGuiderStatus.Success
                        ? t("request-feature.accept")
                        : t("request-feature.reject")
                    }
                    onClick={handleVendorRequest}
                  />
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestVendorDetailsClient;
