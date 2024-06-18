"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useForgotPasswordModal from "@/hook/useForgotPasswordModal";
import useLoginModal from "@/hook/useLoginModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL } from "@/const";
import { ForgotPasswordModalType } from "@/models/modal";
import { ForgotPasswordStep } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

function ForgotPasswordModal({}) {
  const { t } = useTranslation("translation", { i18n });
  const forgotPasswordModel = useForgotPasswordModal();
  const loginModel = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(ForgotPasswordStep.SEND_CODE);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      secret_code: "",
      new_password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const onSubmit = (data: ForgotPasswordModalType) => {
    setIsLoading(true);
    if (step === ForgotPasswordStep.SEND_CODE) {
      const config = {
        params: {
          email: data.email,
        },
        headers: {
          "content-type": "application/json",
        },
      };

      axios
        .post(getApiRoute(RouteKey.ForgotPassword), null, config)
        .then(() => {
          setIsLoading(false);
          toast.success(t("toast.check-your-email-to-get-reset-password-code"));
          setStep(ForgotPasswordStep.VERIFY);
        })
        .catch((err) => {
          toast.error(t("general.something-went-wrong"));
          setIsLoading(false);
        });
    } else if (step === ForgotPasswordStep.VERIFY) {
      const config = {
        params: {
          email: data.email,
          secret_code: data.secret_code,
        },
        headers: {
          "content-type": "application/json",
        },
      };

      axios
        .get(getApiRoute(RouteKey.VerifyResetPassword), config)
        .then(() => {
          setIsLoading(false);
          toast.success(t("toast.verify-successfully"));
          setStep(ForgotPasswordStep.RESET_PASSWORD);
        })
        .catch((err) => {
          toast.error(t("toast.verify-failed"));
          setIsLoading(false);
        });
    } else if (step === ForgotPasswordStep.RESET_PASSWORD) {
      if (data.new_password !== data.confirmPassword) {
        toast.error(t("toast.passwords-not-match"));
        setIsLoading(false);
        return;
      }

      const config = {
        params: {
          email: data.email,
        },
        headers: {
          "content-type": "application/json",
        },
      };

      axios
        .post(
          getApiRoute(RouteKey.ResetPassword),
          { new_password: data.new_password },
          config
        )
        .then(() => {
          setIsLoading(false);
          toast.success(t("toast.reset-password-successfully"));
          reset();
          setStep(ForgotPasswordStep.SEND_CODE);
          forgotPasswordModel.onClose();
          loginModel.onOpen();
        })
        .catch((err) => {
          toast.error(t("toast.reset-password-failed"));
          setIsLoading(false);
        });
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const toggle = useCallback(() => {
    forgotPasswordModel.onClose();
    loginModel.onOpen();
  }, [forgotPasswordModel, loginModel]);

  const bodyContent = (
    <div className="flex flex-col gap-4" onKeyDown={onKeyPress}>
      <Heading
        title={t("components.welcome-back")}
        subtitle={`${t("components.reset-your-password")}!`}
        center
      />
      {step === ForgotPasswordStep.SEND_CODE && (
        <Input
          id="email"
          label={t("general.email")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="email"
        />
      )}
      {step === ForgotPasswordStep.VERIFY && (
        <Input
          id="secret_code"
          label={t("components.secret-code")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      )}
      {step === ForgotPasswordStep.RESET_PASSWORD && (
        <>
          <Input
            id="new_password"
            label={t("components.new-password")}
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
            watchFunc={watch("new_password")}
          />
        </>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div>
          {`${t("components.reset-your-password")}?`}{" "}
          <span
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {t("components.login-here")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModel.isOpen}
      title={t("components.forgot-password")}
      actionLabel={
        step === ForgotPasswordStep.SEND_CODE
          ? t("components.send-code")
          : step === ForgotPasswordStep.VERIFY
          ? t("components.verify")
          : t("components.reset-password")
      }
      onClose={forgotPasswordModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default ForgotPasswordModal;
