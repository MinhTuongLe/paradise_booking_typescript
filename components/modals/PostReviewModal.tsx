/* eslint-disable react/no-unescaped-entities */
"use client";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { BecomeVendorModal } from "@/models/modal";
import ImageUpload from "../inputs/ImageUpload";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function PostReviewModal({}) {
  const router = useRouter();
  const postReviewModal = usePostReviewModal();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSelectTypeMode, setIsSelectTypeMode] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [textareaContent, setTextareaContent] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      username: "",
      phone: "",
      job: "",
      dob: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      cover: "",
      type: 1,
    },
  });
  const cover = watch("cover");
  const setCustomValue = (id: any, value: number | File | null) => {
    setValue(id, value);
  };

  const onSubmit: SubmitHandler<BecomeVendorModal> = (
    data: BecomeVendorModal
  ) => {
    console.log("onSubmit");
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState("auto");

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setTextareaContent(value);
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
  useEffect(() => {
    if (postReviewModal.isOpen) {
      setTextareaHeight("auto");
      setIsSelectTypeMode(false);
      setIsUploadImage(false);
      setOpen(false);
      // textAreaRef?.current?.focus();
    }
  }, [postReviewModal.isOpen]);

  const bodyContent = (
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
          <div className="flex justify-start items-center space-x-3">
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
          <textarea
            ref={textAreaRef}
            className="resize-none w-full focus:outline-none max-h-[40vh]"
            placeholder="What are you thinking about?"
            value={textareaContent}
            onInput={handleTextareaInput}
            style={{ height: textareaHeight, maxHeight: "40vh" }}
          ></textarea>
          {isUploadImage && (
            <ImageUpload
              onChange={(value: File | null) => setCustomValue("cover", value)}
              value={cover}
              classname="h-[40vh] w-full object-cover"
            />
          )}
          <div className="text-md flex justify-between items-center px-3 py-4 rounded-lg border-[1px] border-gray-300">
            <span>Add to your post</span>
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
          </div>
        </>
      ) : (
        <>
          <Heading
            title="What type of article your article??"
            subtitle="Choose for it a suitable type in the categories below"
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
                    onChange={(e) =>
                      setCustomValue("type", Number(e.target.value))
                    }
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
      actionLabel={
        !isSelectTypeMode ? (!postReviewModal.isEdit ? "Post" : "Save") : "Save"
      }
      secondaryActionLabel={!isSelectTypeMode ? undefined : "Back"}
      secondaryAction={() => setIsSelectTypeMode(false)}
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
