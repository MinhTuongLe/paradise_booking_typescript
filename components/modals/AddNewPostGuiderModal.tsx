/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Heading from "../Heading";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { languages, minRequiredImages, post_guider_types } from "@/const";
import { CreatePostGuiderDataSubmit, RentPlaceDataSubmit } from "@/models/api";
import useAddNewPostGuiderModal from "@/hook/useAddNewPostGuiderModal";
import { AddNewPostGuiderStep, PostGuiderType } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MultiSelection from "../inputs/MultiSelection";
import MultiImageUpload from "../inputs/MultiImageUpload";
import { handleFileUpload } from "@/utils/file";

function AddNewPostGuiderModal() {
  const router = useRouter();
  const { t } = useTranslation("translation", { i18n });
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const addNewPostGuiderModal = useAddNewPostGuiderModal();
  const accessToken = Cookie.get("accessToken");

  const [step, setStep] = useState<number>(AddNewPostGuiderStep.LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      images: [],
      description: "",
      address: "",
      schedule: "-",
      topic_id: PostGuiderType.ArtAndCulture,
      post_owner_id: loggedUser?.id,
    },
    mode: "all",
  });

  // const cover = watch("cover");
  const schedule = watch("schedule");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  const setCustomValue = (id: any, value: number | File | string | null) => {
    setValue(id, value);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onClose = () => {
    reset();
    setStep(AddNewPostGuiderStep.LOCATION);
    addNewPostGuiderModal.onClose();
    setSearchResult("");
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setCustomValue("schedule", value);
  };

  const onSubmit = async (data: CreatePostGuiderDataSubmit) => {
    if (step !== AddNewPostGuiderStep.IMAGES) {
      return onNext();
    }

    try {
      // setIsLoading(true);

      // // upload photo
      // const file: string = data.cover;
      // let imageUrl: string | undefined = "";
      // if (file) {
      //   imageUrl = await handleFileUpload(file);
      // }

      // if (!imageUrl) {
      //   toast.warn(t("toast.please-upload-image-to-describe"));
      //   return;
      // }

      if (!uploadedImages || uploadedImages.length < minRequiredImages) {
        const warningMessage =
          !uploadedImages || uploadedImages.length === 0
            ? t("toast.please-upload-image-to-describe")
            : t("toast.please-upload-more-image-to-describe");
        toast.warn(warningMessage);
        return;
      }

      const imageUrls = await handleFileUpload({
        setIsLoading,
        uploadedImages,
        t,
      });

      if (!imageUrls || imageUrls.length < minRequiredImages) {
        const warningMessage = !imageUrls
          ? t("toast.please-upload-image-to-describe")
          : t("toast.please-upload-more-image-to-describe");
        toast.warn(warningMessage);
        return;
      }

      if (!data.address) {
        toast.error(t("toast.please-enter-your-address"));
        setStep(AddNewPostGuiderStep.LOCATION);
        return;
      }

      const submitValues = {
        title: data.title,
        description: data.description,
        address: data.address,
        lat: lat,
        lng: lng,
        images: imageUrls || [],
        topic_id: data.topic_id,
        post_owner_id: loggedUser?.id,
        schedule: data.schedule,
        languages: selectedLanguages,
      };

      // create post guider
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post(getApiRoute(RouteKey.PostGuiders), submitValues, config)
        .then(() => {
          toast.success(t("toast.create-post-guider-successfully"));
          reset();
          setStep(AddNewPostGuiderStep.LOCATION);
          addNewPostGuiderModal.onClose();
          setSearchResult("");
          setLat(null);
          setLng(null);
        })
        .catch(() => {
          toast.error(t("toast.create-post-guider-failed"));
        })
        .finally(() => {
          setIsLoading(false);
        });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === AddNewPostGuiderStep.IMAGES) {
      return t("general.create");
    }

    return t("components.next");
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === AddNewPostGuiderStep.LOCATION) {
      return t("general.cancel");
    }

    return t("components.back");
  }, [step]);

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  const handleImageUpload = (files: File[] | null) => {
    if (files) {
      setUploadedImages(files);
    }
  };

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title={t(
          "post-guider-feature.the-place-will-become-a-place-for-your-trip"
        )}
        subtitle={t("post-guider-feature.help-guest-can-consider")}
        center
      />
      <Input
        id="address"
        label={t("general.address")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <hr />
      <div className="w-full relative">
        <input
          value={searchResult ? searchResult.label : ""}
          id="_location"
          readOnly={true}
          className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 cursor-not-allowed border-neutral-300 focus:outline-none`}
        />

        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 text-zinc-400`}
        >
          {t("property-feature.district-state-and-country")}
        </label>
      </div>
      <Map
        center={[lat || 51, lng || -0.09]}
        onSearchResult={handleSearchResult}
      />
    </div>
  );

  if (step === AddNewPostGuiderStep.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("post-guider-feature.share-some-basics-about-your-trip")}
          subtitle={t("post-guider-feature.share-your-trip-description")}
          center
        />
        <Input
          id="title"
          label={t("general.title")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label={t("general.description")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <div className="relative">
          <textarea
            id="schedule"
            className={`peer resize-none border-2 border-solid py-10 px-4 rounded-md w-full focus:outline-none
          ${!schedule ? "border-rose-500" : "border-neutral-300"} ${
              !schedule ? "focus:border-rose-500" : "focus:outline-none"
            }
          `}
            value={schedule}
            onInput={handleTextareaInput}
            onChange={handleTextareaInput}
            rows={8}
            placeholder={t("post-guider-feature.schedule-desc")}
          ></textarea>
          <label
            className={`left-4 absolute text-md duration-150 transform -translate-y-3 top-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
              !schedule ? "text-rose-500" : "text-zinc-400"
            }`}
          >
            {t("post-guider-feature.trip-schedule")}
          </label>
          {!schedule && (
            <label className="font-sm text-rose-500">
              {`${t("post-guider-feature.schedule")} ${t(
                "form-validation.is-required"
              )}`}
            </label>
          )}
        </div>
        <hr />
        <MultiSelection
          tags={languages.map((lang) => lang.name)}
          title={t("request-feature.your-languages")}
          selected={selectedLanguages}
          setSelected={setSelectedLanguages}
        />
        <hr />
      </div>
    );
  }

  if (step === AddNewPostGuiderStep.TOPIC) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading
          title={t("post-guider-feature.select-your-tour-topic")}
          subtitle={t(
            "post-guider-feature.what-is-the-purpose-of-the-trip-you-organize"
          )}
          center
        />
        {post_guider_types.map((type, index) => {
          return (
            <div key={index}>
              <div className="w-full flex justify-between items-center cursor-pointer">
                <label
                  htmlFor={`type-${index}`}
                  className="text-lg text-zinc-600 font-thin cursor-pointer"
                >
                  {t(`post-guider-types.${type.name}`)}
                </label>
                <input
                  id={`type-${index}`}
                  name="topic_id"
                  type="radio"
                  value={type.value}
                  checked={watch("topic_id") === type.value}
                  className="w-6 h-6 rounded-full cursor-pointer"
                  onChange={(e) =>
                    setCustomValue("topic_id", Number(e.target.value))
                  }
                />
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    );
  }

  if (step === AddNewPostGuiderStep.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("post-guider-feature.add-a-photo-of-your-post")}
          subtitle={t(
            "post-guider-feature.tell-guests-what-the-place-youre-headed-to-looks-like"
          )}
          center
        />
        {/* <ImageUpload
          onChange={(value: File | null) => setCustomValue("cover", value)}
          value={cover}
          classname="h-[40vh] w-full object-cover"
        /> */}
        <MultiImageUpload
          onChange={handleImageUpload}
          values={uploadedImages}
          circle={false}
          cover={true}
          fill={false}
          existedImages={[]}
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={addNewPostGuiderModal.isOpen}
      title={t("post-guider-feature.create-interesting-trips")}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={
        step === AddNewPostGuiderStep.LOCATION ? onClose : onBack
      }
      onClose={addNewPostGuiderModal.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2"
    />
  );
}

export default AddNewPostGuiderModal;
