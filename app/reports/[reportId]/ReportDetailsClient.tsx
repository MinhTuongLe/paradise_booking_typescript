/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import Button from "@/components/Button";
import {
  emptyAvatar,
  emptyImage,
  formatDateType,
  languages,
  post_guider_types,
} from "@/const";
import { Guider } from "@/models/user";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { BecomeGuiderStatus, RequestGuiderType, Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import MultiSelection from "@/components/inputs/MultiSelection";
import EmptyState from "@/components/EmptyState";
import { FaStar } from "react-icons/fa";

const ReportDetailsClient: React.FC<any> = () => {
  const { t } = useTranslation("translation", { i18n });
  const router = useRouter();

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const { register, getValues, watch } = useForm({
    defaultValues: {
      // username: (currentGuiderRequestData as Guider)?.user?.username || "",
      // full_name: (currentGuiderRequestData as Guider)?.user?.full_name || "",
      // avatar: (currentGuiderRequestData as Guider)?.user?.avatar || "",
      // address: (currentGuiderRequestData as Guider)?.user?.address || "",
      // phone: (currentGuiderRequestData as Guider)?.user?.phone || "",
      // dob: (currentGuiderRequestData as Guider)?.user?.dob || "",
      // bio: (currentGuiderRequestData as Guider)?.user?.bio || "",
      // email: (currentGuiderRequestData as Guider)?.user?.email || "",
    },
    mode: "all",
  });

  // const [bio, setBio] = useState(getValues("bio"));

  // const { register: register } = useForm({
  //   defaultValues: {
  //     full_name: (currentGuiderRequestData as Guider).full_name || "",
  //     username: (currentGuiderRequestData as Guider).username || "",
  //     phone: (currentGuiderRequestData as Guider).phone || "",
  //     dob: (currentGuiderRequestData as Guider).dob
  //       ? dayjs((currentGuiderRequestData as Guider).dob).format(
  //           formatDateType.YDM
  //         )
  //       : "",
  //     address: (currentGuiderRequestData as Guider).address || "",
  //     email: (currentGuiderRequestData as Guider).email || "",
  //     experience: (currentGuiderRequestData as Guider).experience || "",
  //     languages:
  //       (currentGuiderRequestData as Guider).languages || selectedLanguages,
  //     goals_of_travel:
  //       (currentGuiderRequestData as Guider).goals_of_travel || selectedGoals,
  //     description: (currentGuiderRequestData as Guider).description || "",
  //     reason: (currentGuiderRequestData as Guider).reason || "",
  //     user_id: (currentGuiderRequestData as Guider).user_id || loggedUser?.id,
  //   },
  //   mode: "all",
  // });

  // // handle guider request
  // const handleGuiderRequest = () => {
  //   setIsLoading(true);
  //   if (
  //     !loggedUser ||
  //     !currentGuiderRequestData ||
  //     isEmpty(currentGuiderRequestData)
  //   )
  //     return;

  //   const accessToken = Cookie.get("accessToken");
  //   const type =
  //     (currentGuiderRequestData as Guider).status &&
  //     (currentGuiderRequestData as Guider).status !== BecomeGuiderStatus.Success
  //       ? RequestGuiderType.Accept
  //       : RequestGuiderType.Reject;
  //   const config = {
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     params: {
  //       request_guider_id: (currentGuiderRequestData as Guider).id,
  //       type,
  //     },
  //   };
  //   axios
  //     .post(getApiRoute(RouteKey.ConfirmRequestGuider), null, config)
  //     .then(() => {
  //       toast.success(
  //         type === RequestGuiderType.Accept
  //           ? t("toast.accepted-guider-request")
  //           : t("toast.rejected-guider-request")
  //       );
  //       router.refresh();
  //     })
  //     .catch((err) => {
  //       console.log("err: ", err);
  //       // toast.error("Something Went Wrong");
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (!isEmpty(currentGuiderRequestData)) {
  //     setSelectedGoals((currentGuiderRequestData as Guider).goals_of_travel);
  //     setSelectedLanguages((currentGuiderRequestData as Guider).languages);
  //   }
  // }, [currentGuiderRequestData]);

  if (!authState || loggedUser?.role !== Role.Admin) {
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
            <h1 className="text-2xl font-bold mb-3">
              {t("report-feature.information-details")}
            </h1>

            {/* Nếu là Place/Post */}
            <div className="space-y-4">
              <div className="flex items-start space-x-6">
                <div className="p-1 rounded shadow-2xl overflow-hidden">
                  <Image
                    width={200}
                    height={200}
                    src={
                      // currentGuiderRequestData &&
                      // !isEmpty(currentGuiderRequestData)
                      //   ? (currentGuiderRequestData as Guider)?.user?.avt
                      //   :
                      emptyImage
                    }
                    alt="Avatar"
                    className="rounded h-[200px] w-[200px]"
                  />
                </div>
                <div className="space-y-2 flex flex-col flex-1">
                  <p className="text-md whitespace-pre-line line-clamp-2">
                    <span className="text-lg font-bold">
                      {t("general.title")}
                    </span>
                    :{" "}
                    {
                      "place/post title place/post title place/post title place/post title place/post title"
                    }
                  </p>
                  <p className="text-md whitespace-pre-line line-clamp-2">
                    <span className="text-lg font-bold">
                      {t("general.description")}
                    </span>
                    :{" "}
                    {
                      "place/post description place/post description place/post description place/post description place/post description"
                    }
                  </p>
                  <p className="text-md whitespace-pre-line line-clamp-2">
                    <span className="text-lg font-bold">
                      {t("general.address")}
                    </span>
                    :{" "}
                    {
                      "place/post address place/post address place/post address place/post address place/post address"
                    }
                  </p>
                  <div className="flex space-x-4">
                    <span className="text-lg font-bold">
                      {t("report-feature.rating")}:{" "}
                    </span>
                    <div className="flex justify-start items-center space-x-2">
                      <div className="flex space-x-2 justify-between items-center">
                        <FaStar size={16} /> <span>0</span>
                      </div>
                      <span>{t("report-feature.with")}</span>
                      <p className="text-md">0 ({t("components.comments")})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-10">
              <h1 className="text-2xl font-bold">
                {t("report-feature.owner")} ({t(`roles.vendor`)})
              </h1>

              {/* Form User thực hiện */}
              <>
                <Input
                  id="full_name"
                  label={t("general.fullname")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="username"
                  label={t("general.username")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="email"
                  label="E-mail"
                  disabled={true}
                  register={register}
                  required
                  type="email"
                />
                <Input
                  id="phone"
                  label={t("general.phone")}
                  disabled={true}
                  register={register}
                  type="tel"
                  required
                />
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
                  id="full_name"
                  label={t("report-feature.report-object")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="username"
                  label={t("report-feature.type")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="email"
                  label={t("general.description")}
                  disabled={true}
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
                    <div className="relative rounded-[8px] aspect-square w-32 h-32 object-cover">
                      <Image
                        alt={`upload-`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={emptyImage}
                      />
                    </div>
                    <div className="relative rounded-[8px] aspect-square w-32 h-32 object-cover">
                      <Image
                        alt={`upload-`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={emptyImage}
                      />
                    </div>
                    <div className="relative rounded-[8px] aspect-square w-32 h-32 object-cover">
                      <Image
                        alt={`upload-`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={emptyImage}
                      />
                    </div>
                    <div className="relative rounded-[8px] aspect-square w-32 h-32 object-cover">
                      <Image
                        alt={`upload-`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={emptyImage}
                      />
                    </div>
                    <div className="relative rounded-[8px] aspect-square w-32 h-32 object-cover">
                      <Image
                        alt={`upload-`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={emptyImage}
                      />
                    </div>

                    {/* {previews.map((preview, index) => (
                    <div
                      key={index}
                      className='relative rounded-[8px] aspect-square w-32 h-32 object-cover'
                    >
                      <Image
                        alt={`upload-${index}`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={preview as string | any}
                      />
                    </div>
                  ))} */}
                  </div>
                  <iframe
                    className="w-full min-h-[300px] h-full rounded-[8px]"
                    src="https://www.youtube.com/embed/ThiCMd5kGbE"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">
                {t("report-feature.report-user")}
              </h1>

              {/* Form User thực hiện */}
              <>
                <Input
                  id="full_name"
                  label={t("general.fullname")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="username"
                  label={t("general.username")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="email"
                  label="E-mail"
                  disabled={true}
                  register={register}
                  required
                  type="email"
                />
                <Input
                  id="phone"
                  label={t("general.phone")}
                  disabled={true}
                  register={register}
                  type="tel"
                  required
                />
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-6">
                    <Button
                      outline
                      label={t("general.cancel")}
                      onClick={() => router.push(`/requests`)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-6">
                    <Button
                      disabled={isLoading}
                      label={
                        // currentGuiderRequestData &&
                        // (currentGuiderRequestData as Guider).status &&
                        // (currentGuiderRequestData as Guider).status !==
                        //   BecomeGuiderStatus.Success
                        //   ? t("request-feature.accept")
                        //   : t("request-feature.reject")
                        t("report-feature.handle")
                      }
                      onClick={() => console.log("handleGuiderRequest")}
                    />
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsClient;
