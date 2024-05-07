/* eslint-disable react/no-unescaped-entities */
"use client";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import useBecomeVendorModal from "../../hook/useBecomeVendorModal";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL } from "@/const";
import { BecomeVendorModal } from "@/models/modal";

function BecomeVendorModal() {
  const becomeVendorModal = useBecomeVendorModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      username: "",
      phone: "",
      dob: "",
      address: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<BecomeVendorModal> = (
    data: BecomeVendorModal
  ) => {
    setIsLoading(true);

    axios.defaults.headers.post["Content-Type"] = "application/json";

    axios
      .post(`${API_URL}/register`, data)
      .then(() => {
        setIsLoading(false);
        toast.success(
          "Register Successfully. Check your email to confirm your registration"
        );
        reset();
        becomeVendorModal.onClose();
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        setIsLoading(false);
      });
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
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="username"
        label="Username"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="email"
      />
      <Input
        id="phone"
        label="Phone Number"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="tel"
      />
      <Input
        id="dob"
        label="Date of Birth"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="date"
      />
      <Input
        id="address"
        label="Address"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <textarea
        className="order border-solid border-2 border-neutral-300 p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
        placeholder="Describe your services"
        id="cancelRules"
        // onChange={(e) => setCustomValue("cancelRules", e.target.value)}
      ></textarea>
      <textarea
        className="order border-solid border-2 border-neutral-300 p-4 rounded-lg w-full focus:outline-none h-[120px] resize-none"
        placeholder="Privacy and safety policies"
        id="cancelRules"
        // onChange={(e) => setCustomValue("cancelRules", e.target.value)}
      ></textarea>
      <div className="flex justify-start items-start space-x-4">
        <div className="translate-y-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-full cursor-pointer"
          />
        </div>
        <div className="text-lg text-zinc-400 font-thin">
          Committed to providing accurate, quality information and adhering to
          website policies, ensuring a positive customer experience
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
    />
  );
}

export default BecomeVendorModal;
