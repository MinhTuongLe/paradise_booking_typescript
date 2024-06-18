/* eslint-disable react/no-unescaped-entities */
"use client";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Cookie from "js-cookie";

import i18n from "@/i18n/i18n";
import useBecomeVendorModal from "../../hook/useBecomeVendorModal";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL, formatDateType } from "@/const";
import { BecomeVendorModalType } from "@/models/modal";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function BecomeVendorModal() {
  const becomeVendorModal = useBecomeVendorModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isCommited, setIsCommited] = useState<boolean>(false);
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const { t } = useTranslation("translation", { i18n });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: loggedUser?.id ?? 0,
      full_name: "",
      username: "",
      phone: "",
      dob: "",
      email: "",
      address: "",
      description: "-",
      experience: "-",
    },
    mode: "all",
  });

  const description = watch("description");
  const experience = watch("experience");

  const setCustomValue = (id: any, value: string) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    fieldName: string
  ) => {
    const { value } = event.target;
    setCustomValue(fieldName, value);
  };

  const onSubmit: SubmitHandler<BecomeVendorModalType> = (
    data: BecomeVendorModalType
  ) => {
    setIsLoading(true);

    if (!loggedUser) return;

    const submitValues = {
      ...data,
      user_id: loggedUser.id,
      dob: data.dob ? dayjs(data.dob).format(formatDateType.DMY2) : "",
    };

    const accessToken = Cookie.get("accessToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(getApiRoute(RouteKey.RequestVendor), submitValues, config)
      .then(() => {
        becomeVendorModal.onClose();
        reset();
        toast.success(t("toast.request-guider-successfully"));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4" onKeyDown={onKeyPress}>
      <Heading
        title="Upgrade your account to vendor"
        subtitle="You will get vendor privileges"
        center
      />
      <Input
        id="full_name"
        label={t("general.fullname")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="username"
        label={t("general.username")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="E-mail"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="email"
      />
      <Input
        id="phone"
        label={t("general.phone")}
        disabled={isLoading}
        register={register}
        errors={errors}
        type="tel"
        required
      />
      <Input
        id="dob"
        label={t("general.dob")}
        disabled={isLoading}
        register={register}
        errors={errors}
        type="date"
      />
      <Input
        id="address"
        label={t("general.address")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="relative">
        <textarea
          id="description"
          className={`peer resize-none border-2 border-solid py-10 px-4 rounded-md w-full focus:outline-none
          ${!description ? "border-rose-500" : "border-neutral-300"} ${
            !description ? "focus:border-rose-500" : "focus:outline-none"
          }
          `}
          value={description}
          onInput={(e) =>
            handleTextareaInput(
              e as React.ChangeEvent<HTMLTextAreaElement>,
              "description"
            )
          }
          onChange={(e) => handleTextareaInput(e, "description")}
          rows={8}
        ></textarea>
        <label
          className={`left-4 absolute text-md duration-150 transform -translate-y-3 top-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
            !description ? "text-rose-500" : "text-zinc-400"
          }`}
        >
          {t("general.description")}
        </label>
        {!description && (
          <label className="font-sm text-rose-500">
            {`Description ${t("form-validation.is-required")}`}
          </label>
        )}
      </div>
      <div className="relative">
        <textarea
          id="experience"
          className={`peer resize-none border-2 border-solid py-10 px-4 rounded-md w-full focus:outline-none
          ${!experience ? "border-rose-500" : "border-neutral-300"} ${
            !experience ? "focus:border-rose-500" : "focus:outline-none"
          }
          `}
          value={experience}
          onInput={(e) =>
            handleTextareaInput(
              e as React.ChangeEvent<HTMLTextAreaElement>,
              "experience"
            )
          }
          onChange={(e) => handleTextareaInput(e, "experience")}
          rows={8}
        ></textarea>
        <label
          className={`left-4 absolute text-md duration-150 transform -translate-y-3 top-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
            !experience ? "text-rose-500" : "text-zinc-400"
          }`}
        >
          {t("request-feature.show-experience")}
        </label>
        {!experience && (
          <label className="font-sm text-rose-500">
            {`${t("request-feature.experience")} ${t(
              "form-validation.is-required"
            )}`}
          </label>
        )}
      </div>
      <div className="flex justify-start items-start space-x-4">
        <div className="translate-y-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-full cursor-pointer"
            checked={isCommited}
            onChange={() => setIsCommited(!isCommited)}
          />
        </div>
        <div className="text-lg text-zinc-400 font-thin">
          {t("request-feature.request-commit-desc")}
        </div>
      </div>
    </div>
  );

  const footerContent = <></>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={becomeVendorModal.isOpen}
      title="Become a vendor"
      actionLabel="Submit"
      onClose={becomeVendorModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
      needCommit={!isCommited}
    />
  );
}

export default BecomeVendorModal;
