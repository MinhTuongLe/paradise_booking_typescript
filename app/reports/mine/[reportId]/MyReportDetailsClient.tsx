/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import Cookie from "js-cookie";

import {
  place_report_types,
  post_guide_report_types,
  account_report_types,
  post_review_comment_report_types,
} from "@/const";
import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import { classNames, emptyAvatar, emptyImage } from "@/const";
import { RootState } from "@/store/store";
import { ReportStatus, ReportTypes } from "@/enum";
import EmptyState from "@/components/EmptyState";
import { Report } from "@/models/report";
import { getRoleName } from "@/utils/getUserInfo";
import CustomCarousel from "@/components/CustomCarousel";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { toast } from "react-toastify";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import MultiImageUpload from "@/components/inputs/MultiImageUpload";
import Loader from "@/components/Loader";
import { handleImageFilesUpload } from "@/utils/file";
import VideoUpload from "@/components/inputs/VideoUpload";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "@/store/firebase";
import { uploadToDatabase } from "@/utils/firebaseHandlers";

interface MyReportDetailsClientProps {
  reportData: Report | undefined;
}

const MyReportDetailsClient: React.FC<MyReportDetailsClientProps> = ({
  reportData,
}) => {
  const { t } = useTranslation("translation", { i18n });

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reportTypeOptions, setReportTypeOptions] = useState<
    { name: string; value: number }[]
  >([]);
  const [selectedReportType, setSelectedReportType] = useState<string>(
    reportData?.type || ""
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existedImages, setExistedImages] = useState<string[]>(
    reportData?.images || []
  );

  const [video, setVideo] = useState<File | null | string>(
    reportData?.videos?.[0] || null
  );

  const { register, getValues } = useForm({
    defaultValues: {
      ...reportData,
      object_name: t(`report-types.${reportData?.object_name}`),
      type: t(`report-types.${reportData?.type}`),
      username: reportData?.user?.username || "-",
      email: reportData?.user?.email || "-",
      full_name: reportData?.user?.full_name || "-",
      phone: reportData?.user?.phone || "-",
      reported_username: reportData?.user_reported?.username || "-",
      reported_email: reportData?.user_reported?.email || "-",
      reported_full_name: reportData?.user_reported?.full_name || "-",
      reported_phone: reportData?.user_reported?.phone || "-",
      reported_address: reportData?.object_value?.address || "-",
      reported_role: reportData?.object_value?.role
        ? t(`roles.${getRoleName(reportData.object_value.role)}`)
        : "-",
    },
    mode: "all",
  });

  // handle update report
  const handleUpdateReport = async () => {
    // setIsLoading(true);
    if (!loggedUser || !reportData?.id) return;

    const accessToken = Cookie.get("accessToken");

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    let imageUrls = [];
    if (uploadedImages && uploadedImages.length > 0) {
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

    if (video) {
      if (typeof video == "string") {
        videoUrl = video;
      } else {
        videoUrl = await handleUploadVideo();
      }
    }

    const submitValues = {
      type: selectedReportType ?? reportData.type,
      description: getValues()?.description ?? reportData.description,
      images: [...existedImages, ...imageUrls] || [],
      videos: [videoUrl],
    };

    console.log("submitValues: ", submitValues);

    axios
      .put(
        getApiRoute(RouteKey.ReportDetails, {
          reportId: reportData?.id,
        }),
        submitValues,
        config
      )
      .then(() => {
        toast.success(t("toast.update-report-successfully"));
        router.refresh();
      })
      .catch((err) => {
        toast.error(t("toast.update-report-failed"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUploadVideo = async () => {
    setIsLoading(true);

    return new Promise<string>((resolve, reject) => {
      let fileUrl = "";
      const fileRef = ref(
        firebaseStorage,
        `/report-videos/${(video! as File).name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, video! as File);

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
            fileUrl = downloadURL;
            resolve(fileUrl);
          });
        }
      );
    });
  };

  const handleImageUpload = (
    files: File[] | null,
    existed: string[] | null
  ) => {
    setUploadedImages(files ?? []);
    setExistedImages(existed ?? []);
  };

  const handleViewDetails = () => {
    const domain = window.location.origin;
    switch (reportData?.object_type) {
      case ReportTypes.Place:
        window.open(`${domain}/listings/${reportData.object_id}`, "_blank");
        break;
      case ReportTypes.Guider:
      case ReportTypes.User:
      case ReportTypes.Vendor:
        window.open(`${domain}/users/${reportData.object_id}`, "_blank");
        break;
      case ReportTypes.Tour:
        window.open(`${domain}/post-guiders/${reportData.object_id}`, "_blank");
        break;
      case ReportTypes.PostReview:
        window.open(`${domain}/post-reviews/${reportData.object_id}`, "_blank");
        break;
      case ReportTypes.Comment:
        window.open(
          `${domain}/post-reviews/${reportData.object_value.post_review_id}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (reportData?.object_type) {
      case ReportTypes.Place:
        setReportTypeOptions(place_report_types);
        break;
      case ReportTypes.Guider:
      case ReportTypes.User:
      case ReportTypes.Vendor:
        setReportTypeOptions(account_report_types);
        break;
      case ReportTypes.Tour:
        setReportTypeOptions(post_guide_report_types);
        break;
      case ReportTypes.PostReview:
      case ReportTypes.Comment:
        setReportTypeOptions(post_review_comment_report_types);
        break;
      default:
        break;
    }
  }, [reportData]);

  if (!authState || !loggedUser) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="sm:col-span-12 xl:col-span-6 space-y-4">
          {/* Thông tin chi tiết */}
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-3">
                {t("report-feature.information-details")}
              </h1>
              <span
                className="text-rose-500 font-semibold text-md cursor-pointer hover:text-rose-700"
                onClick={handleViewDetails}
              >
                {t("components.see-details")}
              </span>
            </div>

            {reportData?.object_type &&
              [
                ReportTypes.Place,
                ReportTypes.Tour,
                ReportTypes.PostReview,
                ReportTypes.Comment,
              ].includes(reportData.object_type) && (
                <div className="space-y-4 mb-10">
                  <div className="space-y-4">
                    {[
                      ReportTypes.Place,
                      ReportTypes.Tour,
                      ReportTypes.PostReview,
                    ].includes(reportData.object_type) && (
                      <>
                        {!isEmpty(reportData?.object_value?.images) && (
                          <div className="w-full aspect-square mb-4 rounded-xl shadow-2xl overflow-hidden bg-center">
                            <CustomCarousel
                              media={
                                reportData.object_value?.images.map(
                                  (image: string) => {
                                    return {
                                      url: image,
                                      type: "image",
                                    };
                                  }
                                ) || []
                              }
                            />
                          </div>
                        )}
                        <div className="space-y-2 flex flex-col flex-1">
                          <p className="text-md whitespace-pre-line line-clamp-2">
                            <span className="text-lg font-bold">
                              {t("general.title")}
                            </span>
                            : {reportData?.object_value?.title || "-"}
                          </p>
                          <p className="text-md whitespace-pre-line line-clamp-2">
                            <span className="text-lg font-bold">
                              {t("general.description")}
                            </span>
                            : {reportData?.object_value?.description || "-"}
                          </p>
                          <p className="text-md whitespace-pre-line line-clamp-2">
                            <span className="text-lg font-bold">
                              {t("general.address")}
                            </span>
                            : {reportData?.object_value?.address || "-"}
                          </p>
                        </div>
                      </>
                    )}
                    {reportData.object_type === ReportTypes.Comment && (
                      <div className="space-y-2 flex flex-col flex-1">
                        <p className="text-md whitespace-pre-line line-clamp-2">
                          <span className="text-lg font-bold">
                            {t("report-feature.comment-content")}
                          </span>
                          : {reportData?.object_value?.content || "-"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            <div className="space-y-4">
              {reportData?.object_type &&
                [
                  ReportTypes.Place,
                  ReportTypes.Tour,
                  ReportTypes.PostReview,
                  ReportTypes.Comment,
                ].includes(reportData.object_type) && (
                  <h1 className="text-2xl font-bold">
                    {t("report-feature.owner")}
                  </h1>
                )}
              {reportData?.object_type &&
                [
                  ReportTypes.Vendor,
                  ReportTypes.Guider,
                  ReportTypes.User,
                ].includes(reportData.object_type) && (
                  <div className="flex items-start justify-between space-x-8">
                    <div className="p-4 rounded-[24px] flex flex-col items-center justify-center shadow-2xl mb-4">
                      <>
                        <Image
                          width={200}
                          height={200}
                          src={
                            reportData && !isEmpty(reportData)
                              ? reportData?.object_value?.avatar
                              : emptyAvatar
                          }
                          alt="Avatar"
                          className="rounded-full h-[200px] w-[200px]"
                        />
                      </>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-bold my-3">
                        {t("request-feature.bio")}
                      </h1>
                      <textarea
                        className="resize-none border border-solid p-4 rounded-[24px] w-full focus:outline-none"
                        rows={5}
                        value={reportData.object_value.bio || "-"}
                      ></textarea>
                    </div>
                  </div>
                )}
              {/* Form User thực hiện */}
              <>
                {reportData?.object_type &&
                  [
                    ReportTypes.Vendor,
                    ReportTypes.Guider,
                    ReportTypes.User,
                  ].includes(reportData.object_type) && (
                    <Input
                      id="reported_role"
                      label={t("general.role")}
                      disabled={true}
                      register={register}
                      required
                    />
                  )}
                <Input
                  id="reported_full_name"
                  label={t("general.fullname")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="reported_username"
                  label={t("general.username")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="reported_email"
                  label="E-mail"
                  disabled={true}
                  register={register}
                  required
                  type="email"
                />
                <Input
                  id="reported_phone"
                  label={t("general.phone")}
                  disabled={true}
                  register={register}
                  type="tel"
                  required
                />
                {reportData?.object_type &&
                  [
                    ReportTypes.Vendor,
                    ReportTypes.Guider,
                    ReportTypes.User,
                  ].includes(reportData.object_type) && (
                    <Input
                      id="reported_address"
                      label={t("general.address")}
                      disabled={true}
                      register={register}
                      required
                    />
                  )}
              </>
            </div>
          </div>
        </div>
        <div className="sm:col-span-12 lg:col-span-6">
          <div className="px-8 pb-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">
                {t("report-feature.report-content")}
              </h1>

              {/* Form Nội dung báo cáo */}
              <>
                <Input
                  id="object_name"
                  label={t("report-feature.report-object")}
                  register={register}
                  required
                  disabled={true}
                />
                <Listbox
                  value={selectedReportType}
                  onChange={(e: any) => {
                    setSelectedReportType(e.name);
                  }}
                >
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <span className="ml-3 block truncate">
                              {t(`report-types.${selectedReportType}`)}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </ListboxButton>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm review-horizontal">
                            {reportTypeOptions
                              .filter(
                                (element) =>
                                  element?.name !== selectedReportType
                              )
                              .map((person) => (
                                <ListboxOption
                                  key={person.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? "bg-rose-100" : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={person}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "ml-3 block truncate"
                                          )}
                                        >
                                          {t(`report-types.${person.name}`)}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-gray-900"
                                              : "text-rose-500",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </ListboxOption>
                              ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
                <Input
                  id="description"
                  label={t("general.description")}
                  register={register}
                  required
                />
                <div className="mt-12">
                  <label
                    className={`text-md duration-150 transform left-4 text-zinc-400`}
                  >
                    {t("report-feature.evidence")}
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2 mb-6">
                    {(uploadedImages && !isEmpty(uploadedImages)) ||
                    (existedImages && !isEmpty(existedImages)) ? (
                      <>
                        {!isLoading ? (
                          <MultiImageUpload
                            onChange={handleImageUpload}
                            values={uploadedImages}
                            circle={false}
                            cover={true}
                            fill={false}
                            existedImages={existedImages}
                          />
                        ) : (
                          <Loader />
                        )}
                      </>
                    ) : (
                      <span className="text-rose-500 font-semibold">
                        {t("report-feature.no-image-evidence")}
                      </span>
                    )}
                  </div>
                  {reportData?.videos && !isEmpty(reportData.videos) ? (
                    <>
                      {!isLoading ? (
                        <VideoUpload
                          onChange={(value: File | null) => setVideo(value)}
                          value={video}
                          classname="h-[40vh] w-full object-cover mb-4"
                        />
                      ) : (
                        <Loader />
                      )}
                    </>
                  ) : (
                    <span className="text-rose-500 font-semibold">
                      {t("report-feature.no-video-evidence")}
                    </span>
                  )}
                </div>
              </>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-6">
                <Button
                  outline
                  label={t("general.cancel")}
                  onClick={() => router.push(`/reports/mine`)}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-6">
                <Button
                  disabled={
                    isLoading || reportData?.status_id === ReportStatus.Complete
                  }
                  label={t("general.update")}
                  onClick={() => handleUpdateReport()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReportDetailsClient;
