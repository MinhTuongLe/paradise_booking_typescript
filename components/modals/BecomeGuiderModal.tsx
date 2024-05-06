/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import useBecomeGuiderModal from "../../hook/useBecomeGuiderModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { languages, post_guider_types } from "@/const";
import { BecomeGuiderModal } from "@/models/modal";
import MultiSelection from "../inputs/MultiSelection";

function BecomeGuiderModal() {
  const becomeGuiderModal = useBecomeGuiderModal();
  const { t } = useTranslation("translation", { i18n });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCommited, setIsCommited] = useState<boolean>(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

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
      experience: "",
      languages: selectedLanguages,
      types: selectedGoals,
      description: "",
      reason_become_guider: "",
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<BecomeGuiderModal> = (
    data: BecomeGuiderModal
  ) => {
    // setIsLoading(true);

    const submitValues = {
      ...data,
      languages: selectedLanguages,
      types: selectedGoals,
    };

    console.log("submitValues: ", submitValues);
    becomeGuiderModal.onClose();

    // axios.defaults.headers.post["Content-Type"] = "application/json";

    // axios
    //   .post(`${API_URL}/register`, data)
    //   .then(() => {
    //     setIsLoading(false);
    //     toast.success(
    //       "Register Successfully. Check your email to confirm your registration"
    //     );
    //     reset();
    //     becomeGuiderModal.onClose();
    //   })
    //   .catch((err) => {
    //     toast.error("Something Went Wrong");
    //     setIsLoading(false);
    //   });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4" onKeyDown={onKeyPress}>
      <Heading
        title="Upgrade your account to guider"
        subtitle="You will get guider privileges"
        center
      />
      <Input
        id="full_name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="username"
        label="Username"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
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
        required
      />
      <Input
        id="dob"
        label="Date of Birth"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="date"
        required
      />
      <Input
        id="address"
        label="Address"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <MultiSelection
        tags={languages.map((lang) => lang.name)}
        title="Your languages"
        selected={selectedLanguages}
        setSelected={setSelectedLanguages}
      />
      <MultiSelection
        tags={post_guider_types.map((post) =>
          t(`post-guider-types.${post.description}`)
        )}
        title="Goals of your travels"
        selected={selectedGoals}
        setSelected={setSelectedGoals}
      />
      <Input
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="experience"
        label="Show your experience to us"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="reason_become_guider"
        label="Why do you want to become a guider?"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

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
          Committed to providing accurate, quality information and adhering to
          website policies, ensuring a positive customer experience
        </div>
      </div>
    </div>
  );

  const footerContent = <></>;

  return (
    <Modal
      disabled={isLoading || !isCommited}
      isOpen={becomeGuiderModal.isOpen}
      title="Become a guider"
      actionLabel="Submit"
      onClose={becomeGuiderModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default BecomeGuiderModal;
