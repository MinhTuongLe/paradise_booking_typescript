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

import Heading from "../Heading";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import Image from "next/image";
import rent_room_1 from "@/public/assets/rent_room_1.png";
import rent_room_2 from "@/public/assets/rent_room_2.png";
import rent_room_3 from "@/public/assets/rent_room_3.png";
import { API_URL } from "@/const";
import { RentPlaceDataSubmit } from "@/models/api";
import { RentModalStep } from "@/enum";

function RentModal() {
  const router = useRouter();
  const rentModel = useRentModal();
  const [step, setStep] = useState<number>(RentModalStep.BECOME_VENDOR);
  const [isLoading, setIsLoading] = useState(false);
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
  });

  const guestCount = watch("max_guest");
  const num_bed = watch("num_bed");
  const bed_room = watch("bed_room");
  const num_place_original = watch("num_place_original");
  const cover = watch("cover");

  const [lat, setLat] = useState(51);
  const [lng, setLng] = useState(-0.09);

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
    if (step !== RentModalStep.DESCRIPTION) {
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
          setStep(RentModalStep.BECOME_VENDOR);
          rentModel.onClose();
          reset();
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
      toast.error("Something went wrong");
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
    if (step === RentModalStep.DESCRIPTION) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === RentModalStep.BECOME_VENDOR) {
      return undefined;
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
      <div className="grid md:grid-cols-2 gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
        <div className="col-span-1 flex items-center justify-center">
          <span className="text-[24px] font-bold">Create your new place</span>
        </div>
        <div className="col-span-1 space-y-6">
          <div className="w-full flex justify-between items-start">
            <div className="w-[70%] flex justify-start items-start space-x-3">
              <span className="text-lg font-bold">1</span>
              <div className="space-y-2">
                <p className="text-lg font-bold">Share your room to us</p>
                <p className="text-md font-normal">
                  Share some information such as the location, capacity of your
                  rent room
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
                <p className="text-lg font-bold">Make your room outstanding</p>
                <p className="text-md font-normal">
                  Add an outstanding image with title and description
                </p>
              </div>
            </div>
            <div className="w-[20%] flex items-center justify-center">
              <Image
                width={400}
                height={400}
                src={rent_room_2}
                alt="image 1"
                className="w-full h-full"
              />
            </div>
          </div>
          <hr />
          <div className="w-full flex justify-between items-start">
            <div className="w-[70%] flex justify-start items-start space-x-3">
              <span className="text-lg font-bold">3</span>
              <div className="space-y-2">
                <p className="text-lg font-bold">Finish and post</p>
                <p className="text-md font-normal">
                  Select options your want and post
                </p>
              </div>
            </div>
            <div className="w-[20%]">
              <Image
                width={400}
                height={400}
                src={rent_room_3}
                alt="image 1"
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
          title="Where is your place located?"
          subtitle="Help guests find you!"
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
  }

  if (step === RentModalStep.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What do you have?"
          center
        />
        <Counter
          title="Guests"
          subtitle="How many guest do you allow?"
          value={guestCount}
          onChange={(value: number) => setCustomValue("max_guest", value)}
        />
        <hr />
        <Counter
          title="Beds"
          subtitle="How many beds do you have?"
          value={num_bed}
          onChange={(value: number) => setCustomValue("num_bed", value)}
        />
        <hr />
        <Counter
          title="Bedrooms"
          subtitle="How many bedrooms in your place?"
          value={bed_room}
          onChange={(value: number) => setCustomValue("bed_room", value)}
        />
        <hr />
        <Counter
          title="Available rooms"
          subtitle="How many available rooms in your place?"
          value={num_place_original}
          onChange={(value: number) =>
            setCustomValue("num_place_original", value)
          }
        />
      </div>
    );
  }

  if (step === RentModalStep.IMAGES) {
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

  if (step === RentModalStep.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your description"
          subtitle="What is your place description?"
          center
        />
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
          id="price_per_night"
          label="Price per Night"
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
      title="Paradise your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={step === RentModalStep.BECOME_VENDOR ? undefined : onBack}
      onClose={rentModel.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2"
    />
  );
}

export default RentModal;
