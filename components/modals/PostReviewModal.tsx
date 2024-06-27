/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdPhotos } from "react-icons/io";
import { MdImageNotSupported } from "react-icons/md";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import usePostReviewModal from "../../hook/usePostReviewModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { emptyAvatar, type_selections } from "@/const";
import { AddPostReviewModalType } from "@/models/modal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Cookie from "js-cookie";
import dynamic from "next/dynamic";
import VideoUpload from "../inputs/VideoUpload";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import Loader from "../Loader";
import { PostReview } from "@/models/post";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getUserName } from "@/utils/getUserInfo";
import { getTopicName } from "@/utils/getTopic";
import { PostReviewStep, Topic } from "@/enum";
import { RouteKey } from "@/routes";
import { getApiRoute } from "@/utils/api";
import MultiImageUpload from "../inputs/MultiImageUpload";
import { handleImageFilesUpload } from "@/utils/file";
import { firebaseStorage } from "@/store/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uploadToDatabase } from "@/utils/firebaseHandlers";

function PostReviewModal({}) {
  const { t } = useTranslation("translation", { i18n });

  const router = useRouter();
  const postReviewModal = usePostReviewModal();
  const accessToken = Cookie.get("accessToken");
  const userId = Cookie.get("userId");
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: postReviewModal?.data?.title || "",
      topic: Topic.OtherServices,
      content: postReviewModal?.data?.content || "",
      images: postReviewModal?.data?.images || [],
      videos: postReviewModal?.data?.videos?.[0] || "",
    },
    mode: "all",
  });

  const videos = watch("videos");
  const content = watch("content");

  const [step, setStep] = useState<number>(PostReviewStep.LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSelectTypeMode, setIsSelectTypeMode] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(
    postReviewModal.isEdit ? true : false
  );
  const [isUploadVideo, setIsUploadVideo] = useState(
    postReviewModal.isEdit ? true : false
  );
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [videoValue, setVideoValue] = useState<File | null | string>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existedImages, setExistedImages] = useState<string[]>([]);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [lat, lng]
  );

  const setCustomValue = (
    id: any,
    value: number | File | string | null | string[]
  ) => {
    setValue(id, value);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const handleUploadVideo = async () => {
    if (typeof videoValue === "string") return videoValue;
    setIsLoading(true);

    return new Promise<string>((resolve, reject) => {
      let fileUrl = "";
      const fileRef = ref(
        firebaseStorage,
        `/review-videos/${videoValue!.name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, videoValue!);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log("error: ", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            uploadToDatabase(downloadURL);
            console.log(downloadURL);
            fileUrl = downloadURL;
            resolve(fileUrl);
          });
        }
      );
    });
  };

  const onSubmit: SubmitHandler<AddPostReviewModalType> = async (
    data: AddPostReviewModalType
  ) => {
    if (step !== PostReviewStep.INFO) {
      return onNext();
    }

    try {
      setIsLoading(true);

      if (
        (postReviewModal.isEdit === true || isUploadImage) &&
        (!uploadedImages || uploadedImages.length < 1) &&
        (!existedImages || existedImages.length < 1)
      ) {
        toast.warn(t("toast.please-upload-image-to-describe"));
        return;
      }
      let imageUrls = [];

      if (postReviewModal.isEdit === true || isUploadImage) {
        imageUrls = await handleImageFilesUpload({
          setIsLoading,
          uploadedImages,
          t,
        });

        if (!imageUrls || imageUrls.length < 1) {
          toast.warn(t("toast.please-upload-image-to-describe"));
          return;
        }
      }

      let videoUrl = "";
      if (videos) {
        if (typeof videos === "string") videoUrl === videos;
        else videoUrl = await handleUploadVideo();
      }

      if (postReviewModal.isEdit === true || isUploadVideo) {
        if (!videoUrl) {
          toast.warn(t("toast.upload-video-failed"));
          return;
        } else toast.success(t("toast.upload-video-successfully"));
      }

      const submitValues = {
        ...data,
        topic: selectedTopic,
        account_id: Number(loggedUser?.id),
        lat: lat,
        lng: lng,
        images:
          postReviewModal.isEdit === true || isUploadImage
            ? [...existedImages, ...imageUrls]
            : [],
        videos:
          postReviewModal.isEdit === true || isUploadVideo ? [videoUrl] : [],
      };

      // create post
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (postReviewModal.isEdit) {
        axios
          .put(
            getApiRoute(RouteKey.PostReviews),
            { ...submitValues, post_review_id: postReviewModal.data },
            config
          )
          .then(() => {
            toast.success(t("toast.update-post-review-successfully"));
            postReviewModal.onClose();
            setStep(PostReviewStep.LOCATION);
            reset();
            setSearchResult("");
            setExistedImages([]);
            setUploadedImages([]);
          })
          .catch(() => {
            toast.error(t("toast.update-post-review-failed"));
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        axios
          .post(getApiRoute(RouteKey.PostReviews), submitValues, config)
          .then(() => {
            toast.success(t("toast.create-post-review-successfully"));
            setStep(PostReviewStep.LOCATION);
            postReviewModal.onClose();
            reset();
            setSearchResult("");
            setLat(null);
            setLng(null);
            setExistedImages([]);
            setUploadedImages([]);
          })
          .catch((err) => {
            console.log("err: ", err);
            toast.error(t("toast.create-post-review-failed"));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
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

  const getPostReview = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        account_id: userId,
      },
    };

    await axios
      .get(
        getApiRoute(RouteKey.PostReviewDetails, {
          postReviewId: postReviewModal.data,
        }),
        config
      )
      .then((response) => {
        const post = response.data.data as PostReview;

        setCustomValue("title", post.title);
        setCustomValue("content", post.content);
        setCustomValue("topic", post.topic_id);
        setSelectedTopic(post.topic_id);
        setExistedImages(post.images);
        setVideoValue(post.videos?.[0] || "");
        setCustomValue("videos", post.videos?.[0] || "");
        setLat(post.lat);
        setLng(post.lng);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === PostReviewStep.INFO) {
      if (!isSelectTypeMode) {
        if (!postReviewModal.isEdit) {
          return t("components.post");
        } else {
          return t("general.save");
        }
      } else {
        return t("general.save");
      }
    }

    return t("components.next");
  }, [step, isSelectTypeMode, postReviewModal.isEdit]);

  const secondActionLabel = useMemo(() => {
    if (step === PostReviewStep.LOCATION) {
      return undefined;
    }

    return t("components.back");
  }, [step]);

  useEffect(() => {
    if (searchResult) {
      setLat(searchResult.y);
      setLng(searchResult.x);
    }
  }, [searchResult]);

  useEffect(() => {
    if (postReviewModal.isOpen) {
      if (postReviewModal.isEdit && postReviewModal.data) {
        getPostReview();
      } else {
        setIsUploadImage(false);
        setExistedImages([]);
        setUploadedImages([]);
        setIsUploadVideo(false);
      }
      setIsSelectTypeMode(false);
      setTextareaHeight("auto");
      setOpen(false);
    } else {
      setSelectedTopic(Topic.OtherServices);
      setTextareaHeight("auto");
      setIsSelectTypeMode(false);
      setIsUploadImage(false);
      setExistedImages([]);
      setUploadedImages([]);
      setOpen(false);
      reset();
    }
  }, [postReviewModal.isOpen, postReviewModal.isEdit]);

  const handleImageUpload = (
    files: File[] | null,
    existed: string[] | null
  ) => {
    setUploadedImages(files ?? []);
    setExistedImages(existed ?? []);
  };

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <ConfirmDeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={() => {
          postReviewModal.onClose();
          setOpen(false);
          setUploadedImages([]);
          setExistedImages([]);
        }}
        content={t("components.update")}
      />
      {isLoading && postReviewModal.isEdit ? (
        <Loader />
      ) : (
        <>
          {!isSelectTypeMode ? (
            <>
              <div className="flex justify-start items-center space-x-3 mb-4">
                <Image
                  width={60}
                  height={60}
                  src={loggedUser?.avatar || emptyAvatar}
                  alt="Avatar"
                  className="rounded-full h-[40px] w-[40px] cursor-pointer"
                  priority
                  onClick={() => {
                    postReviewModal.onClose();
                    router.push(`/users/${loggedUser?.id}`);
                  }}
                />
                <div>
                  <h1
                    className="text-lg font-bold space-y-1 cursor-pointer hover:text-rose-500"
                    onClick={() => {
                      postReviewModal.onClose();
                      router.push(`/users/${loggedUser?.id}`);
                    }}
                  >
                    {loggedUser ? getUserName(loggedUser) : t("general.user")}
                  </h1>
                  <div
                    className="text-center text-xs cursor-pointer hover:text-white hover:bg-rose-500 px-1 py-[2px] rounded-xl border-[1px] border-gray-400 w-[100px]"
                    onClick={() => setIsSelectTypeMode(true)}
                  >
                    {selectedTopic
                      ? t(`type-selections.${getTopicName(selectedTopic)}`)
                      : t("components.select-post-type")}
                  </div>
                </div>
              </div>
              <Input
                id="title"
                label={t("general.title")}
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <textarea
                ref={textAreaRef}
                className="resize-none w-full focus:outline-none max-h-[40vh] mt-4"
                placeholder={t("components.what-are-you-thinking-about-it")}
                value={content}
                onInput={handleTextareaInput}
                onChange={handleTextareaInput}
                style={{ height: textareaHeight, maxHeight: "40vh" }}
              ></textarea>
              {((postReviewModal.isEdit == true &&
                postReviewModal.data !== null) ||
                isUploadImage) && (
                <MultiImageUpload
                  onChange={handleImageUpload}
                  values={uploadedImages}
                  circle={false}
                  cover={true}
                  fill={false}
                  existedImages={existedImages}
                />
              )}
              {((postReviewModal.isEdit == true &&
                postReviewModal.data !== null) ||
                isUploadVideo) && (
                <VideoUpload
                  onChange={(value: File | null) => {
                    setCustomValue("videos", value);
                    setVideoValue(value);
                  }}
                  value={videos}
                  classname="h-[40vh] w-full object-cover mb-4"
                />
              )}
              <div className="text-md flex justify-between items-center px-3 py-4 rounded-lg border-[1px] border-gray-300">
                <span>{t("components.add-to-your-post")}</span>
                <div className="flex space-x-4">
                  {(postReviewModal.isEdit == true &&
                    postReviewModal.data !== null) ||
                  isUploadImage ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsUploadImage(false)}
                    >
                      <MdImageNotSupported size={24} color="#f44668" />
                    </div>
                  ) : (
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
                title={t("components.what-type-of-your-post")}
                subtitle={t("components.choose-for-it-a-suitable-type")}
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
                        {t(`type-selections.${type.name}`)}
                      </label>
                      <input
                        checked={selectedTopic === type.value}
                        id={`topic-${index}`}
                        name="topic"
                        type="radio"
                        value={type.value}
                        className="w-6 h-6 rounded-full cursor-pointer"
                        onChange={(e) => {
                          setSelectedTopic(type.value);
                          setCustomValue("topic", type.name);
                        }}
                      />
                    </div>
                    <hr />
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );

  if (step === PostReviewStep.LOCATION) {
    bodyContent = (
      <>
        {isLoading && postReviewModal.isEdit ? (
          <Loader />
        ) : (
          <div>
            <ConfirmDeleteModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onDelete={() => {
                postReviewModal.onClose();
                setOpen(false);
              }}
              content={t("components.update")}
            />
            <div className="flex flex-col gap-8">
              <Heading
                title={t("components.where-is-your-place-located")}
                subtitle={t("components.help-guests-find-you")}
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
                  {t("property-feature.district-state-and-country")}
                </label>
              </div>
              <Map
                center={[lat || 51, lng || -0.09]}
                onSearchResult={handleSearchResult}
              />
            </div>
          </div>
        )}
      </>
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
            ? t("components.add-your-new-post-review")
            : t("components.edit-your-post-review")
          : t("components.choose-your-post-review-category")
      }
      actionLabel={actionLabel}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={() => {
        if (!isSelectTypeMode && step === PostReviewStep.INFO) onBack();
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
