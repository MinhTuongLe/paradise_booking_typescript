"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "../../hook/useRegisterModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL } from "@/const";
import { RegisterDataSubmit } from "@/models/api";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

function RegisterModal() {
  const { t } = useTranslation("translation", { i18n });
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const onSubmit = (data: RegisterDataSubmit) => {
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      toast.error(t("toast.passwords-not-match"));
      setIsLoading(false);
      return;
    }

    const { confirmPassword, ...formData } = data;
    axios.defaults.headers.post["Content-Type"] = "application/json";

    axios
      .post(getApiRoute(RouteKey.Register), formData)
      .then(() => {
        setIsLoading(false);
        toast.success(t("toast.register-successfully"));
        reset();
        registerModel.onClose();
        loginModel.onOpen();
      })
      .catch((err) => {
        toast.error(err?.response?.data.error || "Something went wrong");
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    loginModel.onOpen();
    registerModel.onClose();
  }, [loginModel, registerModel]);

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4" onKeyDown={onKeyPress}>
      <Heading
        title={t("components.welcome-to-paradise")}
        subtitle={`${t("components.create-an-account")}!`}
        center
      />
      <Input
        id="email"
        label={t("general.email")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="email"
      />
      <Input
        id="password"
        label={t("general.password")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Input
        id="confirmPassword"
        label={t("components.confirm-password")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
        watchFunc={watch("password")}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div>
          {t("components.already-have-an-account")}{" "}
          <span
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {t("navbar.login")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModel.isOpen}
      title={t("navbar.register")}
      actionLabel={t("components.continue")}
      onClose={registerModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default RegisterModal;
