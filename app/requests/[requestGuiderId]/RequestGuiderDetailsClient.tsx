/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import {
  FaCheck,
  FaFlag,
  FaRegAddressCard,
  FaStar,
  FaUserEdit,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CgProfile } from "react-icons/cg";
import { MdModeOfTravel } from "react-icons/md";
import { isEmpty } from "lodash";

import i18n from "@/i18n/i18n";
import Input from "@/components/inputs/Input";
import ListingCard from "@/components/listing/ListingCard";
import Button from "@/components/Button";
import ImageUpload from "@/components/inputs/ImageUpload";
import "../../../styles/globals.css";
import {
  emptyAvatar,
  formatDateTimeType,
  formatDateType,
  languages,
  post_guider_types,
} from "@/const";
import useCommentsModal from "@/hook/useCommentsModal";
import useRoomsModal from "@/hook/useRoomsModal";
import useReportModal from "@/hook/useReportModal";
import useBecomeVendorModal from "@/hook/useBecomeVendorModal";
import { setLoggUser } from "@/components/slice/authSlice";
import Loader from "@/components/Loader";
import { Place, Rating } from "@/models/place";
import { Guider, User } from "@/models/user";
import { UserClientDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { getRoleName, getUserName } from "@/utils/getUserInfo";
import { BecomeGuiderStatus, BookingRatingType, Role } from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import useBecomeGuiderModal from "@/hook/useBecomeGuiderModal";
import { PostGuider } from "@/models/post";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import { BecomeGuiderModal } from "@/models/modal";
import MultiSelection from "@/components/inputs/MultiSelection";
import EmptyState from "@/components/EmptyState";

export interface UserClientProps {
  currentGuiderRequestData: Guider | {};
}

const RequestGuiderDetailsClient: React.FC<UserClientProps> = ({
  currentGuiderRequestData,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const reportModal = useReportModal();
  const commentsModal = useCommentsModal();
  const roomsModal = useRoomsModal();
  const becomeVendorModal = useBecomeVendorModal();
  const becomeGuiderModal = useBecomeGuiderModal();

  const dispatch = useDispatch();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditGuiderRequestMode, setIsEditGuiderRequestMode] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  console.log("currentGuiderRequestData: ", currentGuiderRequestData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: (currentGuiderRequestData as Guider)?.user?.username || "",
      full_name: (currentGuiderRequestData as Guider)?.user?.full_name || "",
      avatar: (currentGuiderRequestData as Guider)?.user?.avatar || "",
      address: (currentGuiderRequestData as Guider)?.user?.address || "",
      phone: (currentGuiderRequestData as Guider)?.user?.phone || "",
      dob: (currentGuiderRequestData as Guider)?.user?.dob || "",
      bio: (currentGuiderRequestData as Guider)?.user?.bio || "",
      email: (currentGuiderRequestData as Guider)?.user?.email || "",
    },
    mode: "all",
  });

  const [bio, setBio] = useState(getValues("bio"));
  const avatar = watch("avatar");
  const setCustomValue = (id: any, value: File) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    getValues: getValues2,
    formState: { errors: errors2 },
  } = useForm({
    defaultValues: {
      full_name: (currentGuiderRequestData as Guider).full_name || "",
      username: (currentGuiderRequestData as Guider).username || "",
      phone: (currentGuiderRequestData as Guider).phone || "",
      dob: (currentGuiderRequestData as Guider).dob
        ? dayjs((currentGuiderRequestData as Guider).dob).format(
            formatDateType.YDM
          )
        : "",
      address: (currentGuiderRequestData as Guider).address || "",
      email: (currentGuiderRequestData as Guider).email || "",
      experience: (currentGuiderRequestData as Guider).experience || "",
      languages:
        (currentGuiderRequestData as Guider).languages || selectedLanguages,
      goals_of_travel:
        (currentGuiderRequestData as Guider).goals_of_travel || selectedGoals,
      description: (currentGuiderRequestData as Guider).description || "",
      reason: (currentGuiderRequestData as Guider).reason || "",
      user_id: (currentGuiderRequestData as Guider).user_id || loggedUser?.id,
    },
    mode: "all",
  });

  const setCustomValue2 = (id: any, value: string | number) => {
    setValue2(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const accessToken = Cookie.get("accessToken");

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

      const imageUrl = response.data.data.url;
      toast.success(t("toast.uploading-photo-successfully"));
      return imageUrl;
    } catch (error) {
      toast.error(t("toast.uploading-photo-failed"));
    } finally {
      setIsLoading(false);
    }
  };

  // save guider request
  const onSubmit: SubmitHandler<any> = (data: any) => {
    // setIsLoading(true);
    // if (!loggedUser || isEmpty(data)) return;
    // const submitValues = {
    //   ...data,
    //   languages: selectedLanguages,
    //   goals_of_travel: selectedGoals,
    //   user_id: loggedUser.id,
    //   dob: (data as BecomeGuiderModal).dob
    //     ? dayjs((data as BecomeGuiderModal).dob).format(formatDateType.DMY2)
    //     : "",
    // };
    // const accessToken = Cookie.get("accessToken");
    // const config = {
    //   headers: {
    //     "content-type": "application/json",
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // };
    // axios
    //   .post(getApiRoute(RouteKey.RequestGuider), submitValues, config)
    //   .then(() => {
    //     reset2();
    //     toast.success(
    //       "Request Successfully. Please wait a few days while we review your information!"
    //     );
    //   })
    //   .catch((err) => {
    //     toast.error("Something Went Wrong");
    //   })
    //   .finally(() => {
    //     setIsEditGuiderRequestMode(false);
    //     setIsEditMode(false);
    //     setIsLoading(false);
    //   });
  };

  useEffect(() => {
    if (!isEmpty(currentGuiderRequestData)) {
      setSelectedGoals((currentGuiderRequestData as Guider).goals_of_travel);
      setSelectedLanguages((currentGuiderRequestData as Guider).languages);
    }
  }, [currentGuiderRequestData, reset2]);

  if (!authState || loggedUser?.role !== Role.Admin) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="sm:col-span-12 xl:col-span-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-start justify-between space-x-8">
            <div className="p-4 rounded-[24px] flex flex-col items-center justify-center shadow-2xl mb-4">
              <>
                <Image
                  width={200}
                  height={200}
                  src={emptyAvatar}
                  // src={
                  //   currentGuiderRequestData &&
                  //   !isEmpty(currentGuiderRequestData)
                  //     ? (currentGuiderRequestData as Guider)?.user?.avatar
                  //     : emptyAvatar
                  // }
                  alt="Avatar"
                  className="rounded-full h-[200px] w-[200px]"
                />
                <h1 className="text-xl font-bold my-2">
                  {currentGuiderRequestData &&
                  !isEmpty(currentGuiderRequestData)
                    ? (currentGuiderRequestData as Guider)?.user?.username
                    : "-"}
                </h1>
              </>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold my-3">
                Tiểu sử
              </h1>
              <textarea
                className="resize-none border border-solid p-4 rounded-[24px] w-full focus:outline-none"
                rows={5}
                placeholder={t("user-feature.add-your-bio-here")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
          </div>
          {/* Xem hồ sơ cá nhân */}
          <div className="space-y-4">
            <Input
              id="full_name"
              label={t("general.fullname")}
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <Input
              id="username"
              label={t("general.username")}
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <Input
              id="phone"
              label={t("general.phone")}
              disabled={isLoading}
              register={register}
              errors={errors}
              type="tel"
            />
            <Input
              id="dob"
              label={t("general.dob")}
              disabled={isLoading}
              register={register}
              errors={errors}
              type="date"
              dob={true}
            />
            <Input
              id="address"
              label={t("general.address")}
              disabled={isLoading}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        <div className="sm:col-span-12 lg:col-span-6">
          <div className="px-8 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">Form Hướng dẫn viên</h1>

            {/* Form Hướng dẫn viên */}
            <>
              <h1 className="text-2xl font-bold my-3"></h1>
              <Input
                id="full_name"
                label="Name"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
              />
              <Input
                id="username"
                label="Username"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
              />
              <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
                type="email"
              />
              <Input
                id="phone"
                label="Phone Number"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                type="tel"
                required
              />
              <Input
                id="dob"
                label="Date of Birth"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                type="date"
                required
              />
              <Input
                id="address"
                label="Address"
                disabled={isLoading}
                register={register2}
                errors={errors2}
              />
              <MultiSelection
                tags={languages.map((lang) => lang.name)}
                title="Your languages"
                selected={selectedLanguages}
                setSelected={setSelectedLanguages}
              />
              <MultiSelection
                tags={post_guider_types.map((post) =>
                  t(`post-guider-types.${post.description}`)
                )}
                title="Goals of your travels"
                selected={selectedGoals}
                setSelected={setSelectedGoals}
              />
              <Input
                id="description"
                label="Description"
                disabled={isLoading}
                register={register2}
                errors={errors2}
              />
              <Input
                id="experience"
                label="Show your experience to us"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
              />
              <Input
                id="reason"
                label="Why do you want to become a guider?"
                disabled={isLoading}
                register={register2}
                errors={errors2}
                required
              />
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <Button
                    outline
                    label={t("general.cancel")}
                    onClick={() => {
                      reset2();
                      setIsEditGuiderRequestMode(false);
                    }}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-6">
                  <Button
                    disabled={
                      isLoading ||
                      (currentGuiderRequestData &&
                        (currentGuiderRequestData as Guider).status &&
                        (currentGuiderRequestData as Guider).status !==
                          BecomeGuiderStatus.Processing)
                    }
                    label={t("general.save")}
                    onClick={handleSubmit2(onSubmit)}
                  />
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestGuiderDetailsClient;
