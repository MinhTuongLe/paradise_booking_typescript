/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { ChangePasswordDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

function ChangePasswordClient() {
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirmed_password: "",
    },
    mode: "all",
  });

  const onSubmit = (data: ChangePasswordDataSubmit) => {
    setIsLoading(true);

    if (data.new_password !== data.confirmed_password) {
      toast.error(t("toast.passwords-not-match"));
      setIsLoading(false);
    } else {
      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { confirmed_password, ...rest } = data;
      axios
        .post(getApiRoute(RouteKey.ChangePassword), rest, config)
        .then(() => {
          setIsLoading(false);
          toast.success(t("toast.change-password-successfully"));
          reset();
        })
        .catch((err) => {
          toast.error(t("toast.change-password-failed"));
          setIsLoading(false);
        });
    }
  };

  if (!authState) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="max-w-[768px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="p-8 col-span-12 space-y-6">
          <h1 className="text-2xl font-bold my-3">
            {t("change-password-feature.change-password")}
          </h1>
          <Input
            id="old_password"
            label={t("change-password-feature.current-password")}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
          />
          <Input
            id="new_password"
            label={t("change-password-feature.new-password")}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
            watchFunc={watch("old_password")}
          />
          <Input
            id="confirmed_password"
            label={t("change-password-feature.confirm-password")}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
            watchFunc={watch("new_password")}
          />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <Button
                outline
                label={t("general.cancel")}
                onClick={() => reset()}
              />
            </div>
            <div className="col-span-6">
              <Button
                disabled={isLoading}
                label={t("general.save")}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordClient;
