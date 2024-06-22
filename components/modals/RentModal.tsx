/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useRentModal from "@/hook/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { AiOutlineCar, AiOutlineWifi } from "react-icons/ai";
import { BiCctv } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { FaFireExtinguisher } from "react-icons/fa";
import { GiButterflyFlower } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineBathtub, MdOutlineCoffeeMaker } from "react-icons/md";
import { RiSafeLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import Image from "next/image";
import rent_room_1 from "@/public/assets/rent-room/rent_room_1.png";
import rent_room_2 from "@/public/assets/rent-room/rent_room_2.png";
import rent_room_3 from "@/public/assets/rent-room/rent_room_3.png";
import { API_URL, minRequiredImages } from "@/const";
import { RentPlaceDataSubmit } from "@/models/api";
import { RentModalStep } from "@/enum";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";
import MultiImageUpload from "../inputs/MultiImageUpload";

function RentModal() {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();
  const rentModel = useRentModal();
  const accessToken = Cookie.get("accessToken");

  const [step, setStep] = useState<number>(RentModalStep.BECOME_VENDOR);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
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
      name: "",
      max_guest: 1,
      num_bed: 1,
      bed_room: 1,
      images: [],
      price_per_night: 1,
      description: "",
      address: "",
      num_place_original: 1,
    },
    mode: "all",
  });

  const guestCount = watch("max_guest");
  const num_bed = watch("num_bed");
  const bed_room = watch("bed_room");
  const num_place_original = watch("num_place_original");

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  const setCustomValue = (id: any, value: number | File | null) => {
    setValue(id, value);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = async (data: RentPlaceDataSubmit) => {
    if (step !== RentModalStep.DESCRIPTION) {
      return onNext();
    }

    try {
      setIsLoading(true);

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

      const imageUrls = await handleFileUpload();

      if (!imageUrls || imageUrls.length < minRequiredImages) {
        const warningMessage = !imageUrls
          ? t("toast.please-upload-image-to-describe")
          : t("toast.please-upload-more-image-to-describe");
        toast.warn(warningMessage);
        return;
      }

      if (!data.address) {
        toast.error(t("toast.please-enter-your-address"));
        setStep(RentModalStep.LOCATION);
        return;
      }

      const submitValues = {
        name: data.name,
        description: data.description,
        price_per_night: Number(data.price_per_night),
        address: data.address,
        // address: address || "",
        // city: city || "",
        // country: country || "",
        // state: city || "",
        max_guest: Number(data.max_guest),
        lat: lat,
        lng: lng,
        images: imageUrls || [],
        num_bed: Number(data.num_bed),
        bed_room: Number(data.bed_room),
        num_place_original: Number(data.num_place_original),
      };

      // create place
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post(getApiRoute(RouteKey.Places), submitValues, config)
        .then(() => {
          toast.success(t("toast.create-place-successfully"));
          reset();
          setStep(RentModalStep.BECOME_VENDOR);
          rentModel.onClose();
          reset();
          setSearchResult("");
          setLat(null);
          setLng(null);
        })
        .catch(() => {
          toast.error(t("toast.create-place-failed"));
        })
        .finally(() => {
          setIsLoading(false);
        });
      router.refresh();
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleFileUpload = async (file: string) => {
  //   try {
  //     setIsLoading(true);

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await axios.post(
  //       getApiRoute(RouteKey.UploadImage),
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const imageUrl = response.data.data.url;
  //     toast.success(t("toast.uploading-photo-successfully"));
  //     return imageUrl;
  //   } catch (error) {
  //     toast.error(t("toast.uploading-photo-failed"));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFileUpload = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      uploadedImages.forEach((file) => {
        formData.append(`files`, file);
      });

      const response = await axios.post(
        getApiRoute(RouteKey.UploadImage),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const imageUrl = response.data.data.map((item: any) => item.url);
      toast.success(t("toast.uploading-photo-successfully"));
      return imageUrl;
    } catch (error) {
      toast.error(t("toast.uploading-photo-failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === RentModalStep.DESCRIPTION) {
      return t("general.create");
    }

    return t("components.next");
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === RentModalStep.BECOME_VENDOR) {
      return undefined;
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
      <div className="grid md:grid-cols-2 gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
        <div className="col-span-1 flex items-center justify-center">
          <span className="text-[24px] font-bold">
            {t("components.create-your-new-place")}
          </span>
        </div>
        <div className="col-span-1 space-y-6">
          <div className="w-full flex justify-between items-start">
            <div className="w-[70%] flex justify-start items-start space-x-3">
              <span className="text-lg font-bold">1</span>
              <div className="space-y-2">
                <p className="text-lg font-bold">
                  {t("components.create-your-new-place")}
                </p>
                <p className="text-md font-normal">
                  {t("components.share-some-information")}
                </p>
              </div>
            </div>
            <div className="w-[20%]">
              <Image
                width={400}
                height={400}
                src={rent_room_1}
                alt="image 1"
                className="w-full h-full"
              />
            </div>
          </div>
          <hr />
          <div className="w-full flex justify-between items-start">
            <div className="w-[70%] flex justify-start items-start space-x-3">
              <span className="text-lg font-bold">2</span>
              <div className="space-y-2">
                <p className="text-lg font-bold">
                  {t("components.make-your-room-outstanding")}
                </p>
                <p className="text-md font-normal">
                  {t(
                    "components.add-an-outstanding-image-with-title-and-description"
                  )}
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-center justify-center">
              <Image
                width={400}
                height={400}
                src={rent_room_2}
                alt="image 2"
                className="w-full h-full"
              />
            </div>
          </div>
          <hr />
          <div className="w-full flex justify-between items-start">
            <div className="w-[70%] flex justify-start items-start space-x-3">
              <span className="text-lg font-bold">3</span>
              <div className="space-y-2">
                <p className="text-lg font-bold">
                  {t("components.finish-and-post")}
                </p>
                <p className="text-md font-normal">
                  {t("components.select-options-your-want-and-post")}
                </p>
              </div>
            </div>
            <div className="w-[20%]">
              <Image
                width={400}
                height={400}
                src={rent_room_3}
                alt="image 3"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === RentModalStep.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.where-is-your-place-located")}
          subtitle={t("components.help-guests-find-you")}
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
  }

  if (step === RentModalStep.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.share-some-basics-about-your-place")}
          subtitle={t("components.what-do-you-have")}
          center
        />
        <Counter
          title={t("general.guests")}
          subtitle={t("components.how-many-guest-do-you-allow")}
          value={guestCount}
          onChange={(value: number) => setCustomValue("max_guest", value)}
          mustBeInteger={true}
        />
        <hr />
        <Counter
          title={t("general.beds")}
          subtitle={t("components.how-many-beds-do-you-have")}
          value={num_bed}
          onChange={(value: number) => setCustomValue("num_bed", value)}
          mustBeInteger={true}
        />
        <hr />
        <Counter
          title={t("general.bedrooms")}
          subtitle={t("components.how-many-bedrooms-in-your-place")}
          value={bed_room}
          onChange={(value: number) => setCustomValue("bed_room", value)}
          mustBeInteger={true}
        />
        <hr />
        <Counter
          title={t("components.available-rooms")}
          subtitle={t("components.how-many-available-rooms-in-your-place")}
          value={num_place_original}
          onChange={(value: number) =>
            setCustomValue("num_place_original", value)
          }
          mustBeInteger={true}
        />
      </div>
    );
  }

  if (step === RentModalStep.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.add-a-photo-of-your-place")}
          subtitle={t("components.show-guests-what-your-place-looks-like")}
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

  if (step === RentModalStep.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("components.now-set-your-description")}
          subtitle={t("components.what-is-your-place-description")}
          center
        />
        <Input
          id="name"
          label={t("general.name")}
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
        <Input
          id="price_per_night"
          label={t("property-feature.price-per-night")}
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModel.isOpen}
      title={`${t("navbar.paradise-your-home")}!`}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={
        step === RentModalStep.BECOME_VENDOR ? undefined : onBack
      }
      onClose={rentModel.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2"
    />
  );
}

export default RentModal;
