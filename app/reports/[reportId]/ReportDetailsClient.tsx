/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import { emptyAvatar, emptyImage } from "@/const";
import { RootState } from "@/store/store";
import { ReportTypes, Role } from "@/enum";
import EmptyState from "@/components/EmptyState";
import { Report } from "@/models/report";
import { getRoleName } from "@/utils/getUserInfo";
import CustomCarousel from "@/components/CustomCarousel";

interface ReportDetailsClientProps {
  reportData: Report | undefined;
}

const ReportDetailsClient: React.FC<ReportDetailsClientProps> = ({
  reportData,
}) => {
  const { t } = useTranslation("translation", { i18n });

  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const { register } = useForm({
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
                        {!isEmpty(reportData?.object_value.images) && (
                          <div className="w-full aspect-square mb-4 rounded-xl shadow-2xl overflow-hidden bg-center">
                            <CustomCarousel
                              media={
                                reportData.object_value.images.map(
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
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="type"
                  label={t("report-feature.type")}
                  disabled={true}
                  register={register}
                  required
                />
                <Input
                  id="description"
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
                    {reportData?.images && !isEmpty(reportData.images) ? (
                      reportData.images.map((image, index) => (
                        <div
                          className="relative rounded-[8px] aspect-square w-32 h-32 object-cover"
                          key={index}
                        >
                          <Image
                            alt={`upload-${index}`}
                            fill
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            src={image || emptyImage}
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-rose-500 font-semibold">
                        {t("report-feature.no-image-evidence")}
                      </span>
                    )}
                  </div>
                  {reportData?.videos && !isEmpty(reportData.videos) ? (
                    reportData.videos.map((video, index) => (
                      <iframe
                        key={index}
                        className="w-full min-h-[300px] h-full rounded-[8px]"
                        src={video}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ))
                  ) : (
                    <span className="text-rose-500 font-semibold">
                      {t("report-feature.no-video-evidence")}
                    </span>
                  )}
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
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsClient;
