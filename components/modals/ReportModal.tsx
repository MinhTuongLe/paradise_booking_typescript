/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Cookie from "js-cookie";

import i18n from "@/i18n/i18n";
import useReportModal from "@/hook/useReportModal";
import Heading from "../Heading";
import Modal from "./Modal";
import {
  place_report_types,
  post_guide_report_types,
  account_report_types,
  post_review_comment_report_types,
} from "@/const";
import { ReportDataSubmit } from "@/models/api";
import { ReportModalStep, ReportStatus, ReportTypes } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MultiImageUpload from "../inputs/MultiImageUpload";
import VideoUpload from "../inputs/VideoUpload";
import { isEmpty } from "lodash";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "@/store/firebase";
import { uploadToDatabase } from "@/utils/firebaseHandlers";

function ReportModal() {
  const reportModal = useReportModal();
  const { t } = useTranslation("translation", { i18n });
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const initReportTypes = reportModal.type;
  const objectId = reportModal.object_id;
  const accessToken = Cookie.get("accessToken");

  const [step, setStep] = useState<number>(ReportModalStep.REASON);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(place_report_types);
  const [reportObject, setReportObject] = useState("");
  const [reportObjectOwner, setReportObjectOwner] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      type: 1,
      object_id: 0,
      object_type: initReportTypes,
      description: "",
      status_id: ReportStatus.Processing,
      user_id: loggedUser?.id ?? 0,
      videos: [],
      images: [],
    },
    mode: "all",
  });

  const setCustomValue = (id: any, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const handleImageFilesUpload = async () => {
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

  const handleUploadVideo = async () => {
    setIsLoading(true);

    return new Promise<string>((resolve, reject) => {
      let fileUrl = "";
      const fileRef = ref(firebaseStorage, `/report-videos/${video!.name}`);
      const uploadTask = uploadBytesResumable(fileRef, video!);

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

  const onSubmit = async (data: ReportDataSubmit) => {
    if (step !== ReportModalStep.EVIDENCE) {
      return onNext();
    }

    let imageUrls = [];
    if (uploadedImages && !isEmpty(uploadedImages))
      imageUrls = await handleImageFilesUpload();

    let videoUrl = "";
    if (video) videoUrl = await handleUploadVideo();

    const reportType = reportData.filter((item) => item.value === data.type)[0]
      .name;
    const submitValues = {
      ...data,
      object_id: objectId,
      type: reportType,
      object_type: initReportTypes,
      images: imageUrls,
      videos: [videoUrl],
    };

    // console.log("submitValues: ", submitValues);
    // return;

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(getApiRoute(RouteKey.Report), submitValues, config)
      .then(() => {
        reportModal.onClose();
        setStep(ReportModalStep.REASON);
        reset();
        toast.success(t("toast.report-successfully"));
      })
      .catch((err) => {
        toast.error(t("toast.report-failed"));
      })
      .finally(() => setIsLoading(false));
  };

  const actionLabel = useMemo(() => {
    if (step === ReportModalStep.EVIDENCE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === ReportModalStep.REASON) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const handleImageUpload = (files: File[] | null) => {
    if (files) {
      setUploadedImages(files);
    }
  };

  useEffect(() => {
    if (initReportTypes) {
      switch (initReportTypes) {
        case ReportTypes.Place:
          setReportData(place_report_types);
          setReportObject("place");
          setReportObjectOwner("vendor");
          break;
        case ReportTypes.Tour:
          setReportData(post_guide_report_types);
          setReportObject("post-guide");
          setReportObjectOwner("guider");
          break;
        case ReportTypes.Guider:
          setReportData(account_report_types);
          setReportObject("account");
          setReportObjectOwner("user");
          break;
        case ReportTypes.Vendor:
          setReportData(account_report_types);
          setReportObject("account");
          setReportObjectOwner("user");
          break;
        case ReportTypes.User:
          setReportData(account_report_types);
          setReportObject("account");
          setReportObjectOwner("user");
          break;
        case ReportTypes.Comment:
          setReportData(post_review_comment_report_types);
          setReportObject("comment");
          setReportObjectOwner("owner");
          break;
        case ReportTypes.PostReview:
          setReportData(post_review_comment_report_types);
          setReportObject("post-review");
          setReportObjectOwner("owner");
          break;
        default:
          setReportData(place_report_types);
          setReportObject("place");
          setReportObjectOwner("vendor");
          break;
      }
    }
  }, [initReportTypes]);

  let bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading
        title={t(`components.why-report-${reportObject}`)}
        subtitle={t(`components.report-not-shared-with-${reportObjectOwner}`)}
        center
      />
      {reportData.map((type, index) => {
        return (
          <div key={index}>
            <div className="w-full flex justify-between items-center cursor-pointer">
              <label
                htmlFor={`type-${index}`}
                className="text-lg text-zinc-600 font-thin cursor-pointer"
              >
                {t(`report-types.${type.name}`)}
              </label>
              <input
                id={`type-${index}`}
                name="type"
                type="radio"
                value={type.value}
                className="w-6 h-6 rounded-full cursor-pointer"
                onChange={(e) => setCustomValue("type", Number(e.target.value))}
                defaultChecked={index === 0}
              />
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );

  if (step === ReportModalStep.DETAILS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title={t(`components.describe-report-reason`)} />
        <textarea
          className="order border-solid border-[1px] p-4 rounded-lg w-full focus:outline-none"
          rows={5}
          onChange={(e) => setCustomValue("description", e.target.value)}
          placeholder={t("components.enter-details")}
        ></textarea>
        <hr />
      </div>
    );
  }

  if (step === ReportModalStep.EVIDENCE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("report-feature.add-evidence-title")}
          subtitle={t("report-feature.add-evidence-desc")}
          center
        />
        <MultiImageUpload
          onChange={handleImageUpload}
          values={uploadedImages}
          circle={false}
          cover={true}
          fill={false}
          existedImages={[]}
        />
        <hr />
        <VideoUpload
          onChange={(value: File | null) => setVideo(value)}
          value={video}
          classname="h-[40vh] w-full object-cover mb-4"
        />
        <hr />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={reportModal.isOpen}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={step === ReportModalStep.REASON ? undefined : onBack}
      onClose={reportModal.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default ReportModal;
