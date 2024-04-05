/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdPhotos } from "react-icons/io";
import { MdCancel, MdImageNotSupported } from "react-icons/md";

import usePostReviewModal from "../../hook/usePostReviewModal";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL, emptyAvatar, type_selections } from "@/const";
import { AddPostReviewModal, BecomeVendorModal } from "@/models/modal";
import ImageUpload from "../inputs/ImageUpload";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Cookie from "js-cookie";
import dynamic from "next/dynamic";
import VideoUpload from "../inputs/VideoUpload";
import { FaVideo, FaVideoSlash } from "react-icons/fa";

const STEPS = {
  LOCATION: 0,
  INFO: 1,
};

function PostReviewModal({}) {
  const router = useRouter();
  const postReviewModal = usePostReviewModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      topic: "Other Services",
      content: "",
      img: "",
      videos: "",
    },
  });

  const img = watch("img");
  const video = watch("videos");
  const content = watch("content");

  const [step, setStep] = useState<number>(STEPS.LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSelectTypeMode, setIsSelectTypeMode] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [isUploadVideo, setIsUploadVideo] = useState(false);
  const [lat, setLat] = useState(51);
  const [lng, setLng] = useState(-0.09);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [searchResult, setSearchResult] = useState<any>(null);

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

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onSubmit: SubmitHandler<AddPostReviewModal> = async (
    data: AddPostReviewModal
  ) => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    try {
      setIsLoading(true);

      // upload photo
      const file: string = data.img;
      let imageUrl: string | undefined = "";
      if (file) {
        imageUrl = await handleFileUpload(file);
      }

      if (!imageUrl) {
        return;
      }

      const submitValues = {
        ...data,
        account_id: Number(Cookie.get("userId")),
        lat: lat,
        lng: lng,
        img: isUploadImage ? imageUrl : "",
        // videos: isUploadImage ? videoUrl : "",
      };

      // create post
      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .post(`${API_URL}/post_reviews`, submitValues, config)
        .then(() => {
          toast.success("Create post review successfully");
          reset();
          setStep(STEPS.LOCATION);
          postReviewModal.onClose();
          reset();
          setSearchResult("");
        })
        .catch(() => {
          toast.error("Create post review failed");
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

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setCustomValue("content", value);
    const currentScrollHeight = textAreaRef.current?.scrollHeight ?? 0;
    // chiều cao mỗi dòng
    const currentLineHeight = 30;
    // số dòng trong textarea
    const numberOfLines = value.split("\n").length;
    const newHeight = Math.min(
      currentScrollHeight,
      numberOfLines * currentLineHeight
    );
    setTextareaHeight(`${newHeight}px`);
  };

  const handleSearchResult = (result: any) => {
    setSearchResult(result);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      if (!isSelectTypeMode) {
        if (!postReviewModal.isEdit) {
          return "Post";
        } else {
          return "Save";
        }
      } else {
        return "Save";
      }
    }

    return "Next";
  }, [step, isSelectTypeMode, postReviewModal.isEdit]);

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    if (postReviewModal.isOpen) {
      setTextareaHeight("auto");
      setIsSelectTypeMode(false);
      setIsUploadImage(false);
      setIsUploadVideo(false);
      setOpen(false);
      // textAreaRef?.current?.focus();
    }
  }, [postReviewModal.isOpen]);

  const [videoValue, setVideoValue] = useState<File | null>(null); // Sử dụng state để lưu trữ file video

  const handleVideoChange = (value: File | null) => {
    setVideoValue(value); // Cập nhật state với file video mới
  };

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={() => {
          postReviewModal.onClose();
          setOpen(false);
        }}
        content="update"
      />
      {!isSelectTypeMode ? (
        <>
          <div className="flex justify-start items-center space-x-3 mb-4">
            <Image
              width={60}
              height={60}
              src={emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[40px] w-[40px] cursor-pointer"
              priority
              onClick={() => router.push("/users/5")}
            />
            <div>
              <h1
                className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                onClick={() => router.push("/users/5")}
              >
                Le Minh Tuong
              </h1>
              <div
                className="text-center text-xs cursor-pointer hover:text-white hover:bg-rose-500 px-1 py-[2px] rounded-xl border-[1px] border-gray-400"
                onClick={() => setIsSelectTypeMode(true)}
              >
                Select post type
              </div>
            </div>
          </div>
          <Input
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <textarea
            ref={textAreaRef}
            className="resize-none w-full focus:outline-none max-h-[40vh] mt-4"
            placeholder="What are you thinking about?"
            value={content}
            onInput={handleTextareaInput}
            style={{ height: textareaHeight, maxHeight: "40vh" }}
          ></textarea>
          {isUploadImage && (
            <ImageUpload
              onChange={(value: File | null) => setCustomValue("img", value)}
              value={img}
              classname="h-[40vh] w-full object-cover mb-4"
            />
          )}
          {isUploadVideo && (
            // <VideoUpload
            //   width={400}
            //   height={300}
            //   value={video}
            //   // onChange={(value: File | null) => setCustomValue("videos", value)}
            //   onChange={handleVideoChange}
            // />
            <VideoUpload
              onChange={(value: File | null) => setCustomValue("videos", value)}
              value={video}
              classname="h-[40vh] w-full object-cover mb-4"
            />
          )}
          <div className="text-md flex justify-between items-center px-3 py-4 rounded-lg border-[1px] border-gray-300">
            <span>Add to your post</span>
            <div className="flex space-x-4">
              {!isUploadImage ? (
                <div
                  className="flex space-x-2 items-center"
                  onClick={() => setIsUploadImage((prev) => !prev)}
                >
                  <IoMdPhotos
                    size={24}
                    color="#05a569"
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => setIsUploadImage(false)}
                >
                  <MdImageNotSupported size={24} color="#f44668" />
                </div>
              )}
              {!isUploadVideo ? (
                <div
                  className="flex space-x-2 items-center"
                  onClick={() => setIsUploadVideo((prev) => !prev)}
                >
                  <FaVideo
                    size={24}
                    color="#05a569"
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => setIsUploadVideo(false)}
                >
                  <FaVideoSlash size={24} color="#f44668" />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Heading
            title="What type of article your article??"
            subtitle="Choose for it a suitable type in the categories below"
            center
          />
          {type_selections.map((type, index) => {
            return (
              <div key={index}>
                <div className="w-full flex justify-between items-center cursor-pointer py-3">
                  <label
                    htmlFor={`type-${index}`}
                    className="text-lg text-zinc-600 font-thin cursor-pointer"
                  >
                    {type.name}
                  </label>
                  <input
                    id={`type-${index}`}
                    name="type"
                    type="radio"
                    value={type.value}
                    className="w-6 h-6 rounded-full cursor-pointer"
                    onChange={(e) => setCustomValue("topic", type.name)}
                  />
                </div>
                <hr />
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
          center
        />
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

  const footerContent = <></>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={postReviewModal.isOpen}
      title={
        !isSelectTypeMode
          ? !postReviewModal.isEdit
            ? "Add your new post review"
            : "Edit your post review"
          : "Choose your post review category"
      }
      actionLabel={actionLabel}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={() => {
        if (!isSelectTypeMode && step === STEPS.INFO) onBack();
        else setIsSelectTypeMode(false);
      }}
      onClose={
        !postReviewModal.isEdit
          ? () => postReviewModal.onClose()
          : () => setOpen(true)
      }
      onSubmit={
        !isSelectTypeMode
          ? handleSubmit(onSubmit)
          : () => setIsSelectTypeMode(false)
      }
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
      needConfirm={true}
    />
  );
}

export default PostReviewModal;
