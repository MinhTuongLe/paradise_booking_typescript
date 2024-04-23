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

import Heading from "../Heading";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import rent_room_1 from "@/public/assets/rent_room_1.png";
import rent_room_2 from "@/public/assets/rent_room_2.png";
import rent_room_3 from "@/public/assets/rent_room_3.png";
import { API_URL } from "@/const";
import { RentPlaceDataSubmit } from "@/models/api";
import useAddNewPostGuiderModal from "@/hook/useAddNewPostGuiderModal";
import { AddNewPostReviewStep } from "@/enum";

function AddNewPostGuiderModal() {
  const router = useRouter();
  const addNewPostGuiderModal = useAddNewPostGuiderModal();
  const [step, setStep] = useState<number>(AddNewPostReviewStep.LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState(51);
  const [lng, setLng] = useState(-0.09);
  const [searchResult, setSearchResult] = useState<any>(null);

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
      cover: "",
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
  const cover = watch("cover");

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

  const onClose = () => {
    reset();
    setStep(AddNewPostReviewStep.LOCATION);
    addNewPostGuiderModal.onClose();
    setSearchResult("");
  };

  // function processSearchResult() {
  //   const numberRegex = /^[0-9]+$/;
  //   let country = "";
  //   let city = "";
  //   let address = "";
  //   if (searchResult) {
  //     const array = searchResult?.label.split(", ");

  //     if (array) {
  //       const length = array.length;
  //       country = array[length - 1];
  //       city = numberRegex.test(array[length - 2])
  //         ? array[length - 3]
  //         : array[length - 2];
  //       const temp = numberRegex.test(array[length - 2])
  //         ? array.slice(0, length - 3)
  //         : array.slice(0, length - 2);
  //       address = temp && temp.length > 1 ? temp.join(", ") : temp.join("");
  //     }
  //   }
  //   return { country, city, address };
  // }

  const onSubmit = async (data: RentPlaceDataSubmit) => {
    if (step !== AddNewPostReviewStep.IMAGES) {
      return onNext();
    }

    try {
      // console.log(data, lat, lng);
      setIsLoading(true);

      // upload photo
      const file: string = data.cover;
      let imageUrl: string | undefined = "";
      if (file) {
        imageUrl = await handleFileUpload(file);
      }

      // const { country, city, address } = processSearchResult();

      // if (!country || !city || !address) {
      if (!data.address) {
        toast.error("Please Enter Your Address");
        setStep(AddNewPostReviewStep.LOCATION);
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
        cover: imageUrl,
        num_bed: Number(data.num_bed),
        bed_room: Number(data.bed_room),
        num_place_original: Number(data.num_place_original),
      };

      // create place
      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post(`${API_URL}/places`, submitValues, config)
        .then(() => {
          toast.success("Create place successfully");
          reset();
          setStep(AddNewPostReviewStep.LOCATION);
          addNewPostGuiderModal.onClose();
          setSearchResult("");
        })
        .catch(() => {
          toast.error("Create place failed");
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

  const handleFileUpload = async (file: string) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const accessToken = Cookie.get("accessToken");

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const imageUrl = response.data.data.url;
      toast.success("Uploading photo successfully");
      return imageUrl;
    } catch (error) {
      toast.error("Uploading photo failed");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (step === AddNewPostReviewStep.IMAGES) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === AddNewPostReviewStep.LOCATION) {
      return "Cancel";
    }

    return "Back";
  }, [step]);

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
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
        title="The place will become a place for your trip"
        subtitle="Help guest can consider!"
        center
      />
      <Input
        id="address"
        label="Address"
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
          District, State and Country
        </label>
      </div>
      <Map center={[lat, lng]} onSearchResult={handleSearchResult} />
    </div>
  );

  if (step === AddNewPostReviewStep.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your trip"
          subtitle="Share your trip size and its description?"
          center
        />
        <Counter
          title="Guests"
          subtitle="How many guest do you allow?"
          value={guestCount}
          onChange={(value: number) => setCustomValue("max_guest", value)}
        />
        <hr />
        <Input
          id="name"
          label="Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="note"
          label="Note"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
      </div>
    );
  }

  if (step === AddNewPostReviewStep.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
          center
        />
        <ImageUpload
          onChange={(value: File | null) => setCustomValue("cover", value)}
          value={cover}
          classname="h-[40vh] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={addNewPostGuiderModal.isOpen}
      title="Create interesting trips!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={
        step === AddNewPostReviewStep.LOCATION ? onClose : onBack
      }
      onClose={addNewPostGuiderModal.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2"
    />
  );
}

export default AddNewPostGuiderModal;
