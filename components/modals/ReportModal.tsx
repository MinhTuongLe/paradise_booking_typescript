/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Cookie from "js-cookie";

import i18n from "@/i18n/i18n";
import useReportModal from "@/hook/useReportModal";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import rent_room_1 from "@/public/assets/rent_room_1.png";
import rent_room_2 from "@/public/assets/rent_room_2.png";
import rent_room_3 from "@/public/assets/rent_room_3.png";
import {
  place_report_types,
  post_guide_report_types,
  account_report_types,
  post_review_comment_report_types,
} from "@/const";
import { ReportDataSubmit } from "@/models/api";
import { ReportStatus, ReportTypes } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";

const STEPS = {
  REASON: 0,
  DETAILS: 1,
};

function ReportModal() {
  const router = useRouter();
  const reportModal = useReportModal();
  const { t } = useTranslation("translation", { i18n });
  const initReportTypes = reportModal.type;

  const [step, setStep] = useState<number>(STEPS.REASON);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(place_report_types);
  const [reportObject, setReportObject] = useState("");
  const [reportObjectOwner, setReportObjectOwner] = useState("");

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      type: 1,
      object_id: 0,
      object_type: initReportTypes,
      description: "",
      status_id: ReportStatus.Processing,
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

  const onSubmit = (data: ReportDataSubmit) => {
    if (step !== STEPS.DETAILS) {
      return onNext();
    }

    const reportType = reportData.filter((item) => item.value === data.type)[0]
      .name;
    const submitValues = {
      ...data,
      type: reportType,
      // place: reportModal.place?.name,
      // user: reportModal.user?.full_name || reportModal.user?.username,
    };
    console.log("submitValues: ", submitValues);

    return;
    const accessToken = Cookie.get("accessToken");

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(getApiRoute(RouteKey.Report), submitValues, config)
      .then(() => {
        toast.success(t("toast.report-successfully"));
      })
      .catch((err) => {
        toast.error(t("toast.report-failed"));
      })
      .finally(() => setIsLoading(false));
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DETAILS) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.REASON) {
      return undefined;
    }

    return "Back";
  }, [step]);

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
        default:
          setReportData(place_report_types);
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
                checked={type.value === getValues("type")}
              />
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );

  if (step === STEPS.DETAILS) {
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

  return (
    <Modal
      disabled={isLoading}
      isOpen={reportModal.isOpen}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={step === STEPS.REASON ? undefined : onBack}
      onClose={reportModal.onClose}
      body={bodyContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default ReportModal;
