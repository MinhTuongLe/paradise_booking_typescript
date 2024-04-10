"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

import useForgotPasswordModal from "@/hook/useForgotPasswordModal";
import useLoginModal from "@/hook/useLoginModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL, ForgotPasswordStep } from "@/const";
import { ForgotPasswordModal } from "@/models/modal";

function ForgotPasswordModal({}) {
  const forgotPasswordModel = useForgotPasswordModal();
  const loginModel = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(ForgotPasswordStep.SEND_CODE);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      secret_code: "",
      new_password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ForgotPasswordModal) => {
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
        .post(`${API_URL}/forgot/password`, null, config)
        .then(() => {
          setIsLoading(false);
          toast.success("Check your email to get reset password code");
          setStep(ForgotPasswordStep.VERIFY);
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
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
        .get(`${API_URL}/verify_reset_password`, config)
        .then(() => {
          setIsLoading(false);
          toast.success("Verify successfully");
          setStep(ForgotPasswordStep.RESET_PASSWORD);
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
          setIsLoading(false);
        });
    } else if (step === ForgotPasswordStep.RESET_PASSWORD) {
      if (data.new_password !== data.confirmPassword) {
        toast.error("Password and Confirm Password do not match");
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
          `${API_URL}/reset/password`,
          { new_password: data.new_password },
          config
        )
        .then(() => {
          setIsLoading(false);
          toast.success("Reset Password Successfully");
          reset();
          setStep(ForgotPasswordStep.SEND_CODE);
          forgotPasswordModel.onClose();
          loginModel.onOpen();
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
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
      <Heading title="Welcome Back" subtitle="Reset your password!" center />
      {step === ForgotPasswordStep.SEND_CODE && (
        <Input
          id="email"
          label="Email Address"
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
          label="Secret Code"
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
            label="New Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
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
          {`Remember your password?`}{" "}
          <span
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModel.isOpen}
      title="Forgot Password"
      actionLabel={
        step === ForgotPasswordStep.SEND_CODE
          ? "Send Code"
          : step === ForgotPasswordStep.VERIFY
          ? "Verify"
          : "Reset Password"
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
