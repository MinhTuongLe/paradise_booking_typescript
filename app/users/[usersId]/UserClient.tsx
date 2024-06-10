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
import { TbHomeCog } from "react-icons/tb";

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
import { Guider, User, Vendor } from "@/models/user";
import { UserClientDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { getRoleName, getUserName } from "@/utils/getUserInfo";
import {
  BecomeGuiderStatus,
  BookingRatingType,
  ReportTypes,
  Role,
} from "@/enum";
import { getApiRoute } from "@/utils/api";
import { RouteKey } from "@/routes";
import useBecomeGuiderModal from "@/hook/useBecomeGuiderModal";
import { PostGuider } from "@/models/post";
import PostGuiderCardVertical from "@/components/post-guiders/PostGuiderCardVertical";
import { BecomeGuiderModal, BecomeVendorModal } from "@/models/modal";
import MultiSelection from "@/components/inputs/MultiSelection";
import { IoClose } from "react-icons/io5";

export interface UserClientProps {
  places?: Place[];
  post?: PostGuider[];
  currentUser: User | undefined;
  role: number;
  currentGuiderRequestData: Guider | {};
  currentVendorRequestData: Vendor | {};
}

const UserClient: React.FC<UserClientProps> = ({
  places,
  post,
  currentUser,
  role,
  currentGuiderRequestData,
  currentVendorRequestData,
}) => {
  const { t } = useTranslation("translation", { i18n });
  const reportModal = useReportModal();
  const commentsModal = useCommentsModal();
  const roomsModal = useRoomsModal();
  const becomeVendorModal = useBecomeVendorModal();
  const becomeGuiderModal = useBecomeGuiderModal();
  const accessToken = Cookie.get("accessToken");

  const dispatch = useDispatch();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const verified =
    currentUser?.id !== loggedUser?.id &&
    (role === Role.Vendor || role === Role.Guider);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditGuiderRequestMode, setIsEditGuiderRequestMode] = useState(false);
  const [isEditVendorRequestMode, setIsEditVendorRequestMode] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // profile cá nhân
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: verified
      ? {
          username: currentUser?.username || "",
          full_name: currentUser?.full_name || "",
          avatar: currentUser?.avatar || "",
          address: currentUser?.address || "",
          phone: currentUser?.phone || "",
          dob: currentUser?.dob || "",
          bio: currentUser?.bio || "",
          email: currentUser?.email || "",
        }
      : {
          username: loggedUser?.username || "",
          full_name: loggedUser?.full_name || "",
          avatar: loggedUser?.avatar || "",
          address: loggedUser?.address || "",
          phone: loggedUser?.phone || "",
          dob: loggedUser?.dob || "",
          bio: loggedUser?.bio || "",
          email: loggedUser?.email || "",
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

  // guider profile
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
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

  // vendor profile
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    formState: { errors: errors3 },
  } = useForm({
    defaultValues: {
      user_id: loggedUser?.id ?? 0,
      full_name: (currentVendorRequestData as Vendor).full_name || "",
      username: (currentVendorRequestData as Vendor).username || "",
      phone: (currentVendorRequestData as Vendor).phone || "",
      dob: (currentVendorRequestData as Vendor).dob
        ? dayjs((currentVendorRequestData as Vendor).dob).format(
            formatDateType.YDM
          )
        : "",
      email: (currentVendorRequestData as Vendor).email || "",
      address: (currentVendorRequestData as Vendor).address || "",
      description: (currentVendorRequestData as Vendor).description || "-",
      experience: (currentVendorRequestData as Vendor).experience || "-",
    },
    mode: "all",
  });

  const description = watch3("description");
  const experience = watch3("experience");

  const setCustomValue3 = (id: any, value: string) => {
    setValue3(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    fieldName: string
  ) => {
    const { value } = event.target;
    setCustomValue3(fieldName, value);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

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

  // save profile
  const onSubmit = async (data: UserClientDataSubmit) => {
    try {
      setIsLoading(true);

      // upload photo
      let imageUrl: string | undefined = "";
      if (data.avatar) {
        const file = data.avatar;
        if (typeof file === "string") {
          imageUrl = loggedUser?.avatar;
        } else {
          imageUrl = await handleFileUpload(file);
        }
      }

      const { avatar, ...omitData } = data;
      const submitValues = {
        ...omitData,
        bio,
        avatar: imageUrl,
      };

      // update profile
      const config = {
        headers: {
          "content-type": "application/json",
        },
        Authorization: `Bearer ${accessToken}`,
      };

      axios
        .patch(
          getApiRoute(RouteKey.AccountDetails, { accountId: currentUser?.id }),
          submitValues,
          config
        )
        .then(() => {
          setIsLoading(false);
          setIsEditMode(false);
          dispatch(
            setLoggUser({
              id: currentUser?.id,
              role: currentUser?.role,
              ...submitValues,
            } as User)
          );
          toast.success(t("toast.update-profile-successfully"));
        })
        .catch((err) => {
          toast.error(t("toast.update-profile-failed"));
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // save guider request
  const onSubmit2: SubmitHandler<BecomeGuiderModal | {}> = (
    data: BecomeGuiderModal | {}
  ) => {
    setIsLoading(true);

    if (!loggedUser || isEmpty(data)) return;

    const submitValues = {
      ...data,
      languages: selectedLanguages,
      goals_of_travel: selectedGoals,
      user_id: loggedUser.id,
      dob: (data as BecomeGuiderModal).dob
        ? dayjs((data as BecomeGuiderModal).dob).format(formatDateType.DMY2)
        : "",
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(getApiRoute(RouteKey.RequestGuider), submitValues, config)
      .then(() => {
        reset2();
        toast.success(t("toast.request-guider-successfully"));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditGuiderRequestMode(false);
        setIsEditVendorRequestMode(false);
        setIsEditMode(false);
        setIsLoading(false);
      });
  };

  // save vendor request
  const onSubmit3: SubmitHandler<BecomeVendorModal | {}> = (
    data: BecomeVendorModal | {}
  ) => {
    setIsLoading(true);

    if (!loggedUser || isEmpty(data)) return;

    const submitValues = {
      ...data,
      user_id: loggedUser.id,
      dob: (data as BecomeVendorModal).dob
        ? dayjs((data as BecomeVendorModal).dob).format(formatDateType.DMY2)
        : "",
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .post(getApiRoute(RouteKey.RequestVendor), submitValues, config)
      .then(() => {
        reset2();
        toast.success(t("toast.request-guider-successfully"));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditGuiderRequestMode(false);
        setIsEditVendorRequestMode(false);
        setIsEditMode(false);
        setIsLoading(false);
      });
  };

  const handleBecomeVendor = () => {
    becomeVendorModal.onOpen();
  };

  const handleBecomeGuider = () => {
    becomeGuiderModal.onOpen();
  };

  const getRatings = async ({ role }: { role: Role }) => {
    setIsLoading(true);

    const object_type =
      role === Role.Vendor
        ? BookingRatingType.BookingRatingTypePlace
        : role === Role.Guider
        ? BookingRatingType.BookingRatingTypeGuide
        : null;

    if (!object_type) {
      return;
    }

    await axios
      .get(getApiRoute(RouteKey.BookingRatingsByVendorId), {
        params: {
          vendor_id: currentUser?.id,
          object_type,
        },
      })
      .then((response) => {
        setRatings(response.data.data.ListRating);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isEmpty(currentGuiderRequestData)) {
      setSelectedGoals((currentGuiderRequestData as Guider).goals_of_travel);
      setSelectedLanguages((currentGuiderRequestData as Guider).languages);
    }
  }, [currentGuiderRequestData, reset2]);

  useEffect(() => {
    if (currentUser?.role === Role.Vendor) getRatings({ role: Role.Vendor });
    if (currentUser?.role === Role.Guider) getRatings({ role: Role.Guider });
  }, [currentUser]);

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="sm:col-span-12 xl:col-span-4">
          <div className="p-8 rounded-[24px] flex flex-col items-center justify-center shadow-2xl">
            {isEditMode ? (
              <>
                <ImageUpload
                  onChange={(value: any) => setCustomValue("avatar", value)}
                  value={
                    loggedUser?.avatar || currentUser?.avatar || avatar || ""
                  }
                  circle={true}
                />
              </>
            ) : (
              <>
                <Image
                  width={200}
                  height={200}
                  src={
                    verified
                      ? currentUser?.avatar || emptyAvatar
                      : loggedUser?.avatar || emptyAvatar
                  }
                  alt="Avatar"
                  className="rounded-full h-[200px] w-[200px]"
                />
                <h1 className="text-2xl font-bold my-3">
                  {verified ? currentUser?.username : loggedUser?.username}
                </h1>
                <span className="text-xl">
                  {role ? t(`roles.${getRoleName(role)}`) : t("general.user")}
                </span>
              </>
            )}
          </div>
          <>
            {isEditMode ? (
              <>
                <h1 className="text-xl font-bold my-3">
                  {t("user-feature.your-bio")}
                </h1>
                <textarea
                  className="resize-none border border-solid p-8 rounded-[24px] w-full focus:outline-none"
                  rows={5}
                  placeholder={t("user-feature.add-your-bio-here")}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </>
            ) : (
              <>
                <div className="mt-12 p-8 rounded-[24px] border-[1px] border-[#cdcdcd]">
                  <h1 className="text-xl font-bold mb-3">
                    {currentUser?.id !== loggedUser?.id && currentUser
                      ? t("user-feature.verified-information") +
                        " " +
                        getUserName(currentUser)
                      : t("user-feature.your-verified-information")}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4 mt-4">
                    <FaCheck className="text-[16px]" />
                    {/* <IoClose className="text-[28px] font-bold" /> */}
                    <span>{t("user-feature.email-verification")}</span>
                  </div>
                  <div
                    className={`flex items-center space-x-4 ${
                      currentUser?.id === loggedUser?.id &&
                      role === Role.User &&
                      "mb-8"
                    } mt-4`}
                  >
                    {currentGuiderRequestData &&
                    (currentGuiderRequestData as Guider).status &&
                    (currentGuiderRequestData as Guider).status !==
                      BecomeGuiderStatus.Processing ? (
                      <FaCheck className="text-[16px]" />
                    ) : (
                      <IoClose className="text-[28px] font-bold" />
                    )}
                    <span>{t("user-feature.profile-verification")}</span>
                  </div>
                  {currentUser?.id === loggedUser?.id && (
                    <>
                      {currentUser?.id === loggedUser?.id &&
                        currentUser?.role === Role.User && (
                          <>
                            <hr />
                            <div className="my-8">
                              {t("user-feature.need-verification")}
                            </div>
                          </>
                        )}
                      <div className="space-y-8">
                        {role === Role.User && (
                          <Button
                            disabled={loggedUser?.role === Role.Vendor}
                            outline={loggedUser?.role === Role.Vendor}
                            label={t("user-feature.become-a-vendor")}
                            onClick={handleSubmit(handleBecomeVendor)}
                          />
                        )}
                        {role === Role.User &&
                          (!currentGuiderRequestData ||
                            !(currentGuiderRequestData as Guider)?.status) && (
                            <Button
                              disabled={loggedUser?.role === Role.Guider}
                              outline={loggedUser?.role === Role.Guider}
                              label={t("user-feature.become-a-guider")}
                              onClick={handleBecomeGuider}
                            />
                          )}
                      </div>
                    </>
                  )}
                </div>
                {verified && (
                  <div className="w-full flex justify-center items-start mt-6">
                    <div
                      className="flex justify-center items-center gap-4 cursor-pointer"
                      onClick={() =>
                        reportModal.onOpen({
                          type:
                            currentUser?.role === Role.Guider
                              ? ReportTypes.Guider
                              : currentUser?.role === Role.Vendor
                              ? ReportTypes.Vendor
                              : ReportTypes.User,
                          object_id: currentUser?.id ?? 0,
                        })
                      }
                    >
                      <FaFlag size={16} />
                      <span className="underline">
                        {role === Role.Vendor
                          ? t("user-feature.report-this-vendor")
                          : role === Role.Guider
                          ? t("user-feature.report-this-guider")
                          : t("user-feature.report-this-user")}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </div>
        <div className="sm:col-span-12 lg:col-span-8">
          <div className="px-8 pb-8 space-y-4">
            <h1 className="text-2xl font-bold">
              {!isEditMode && !isEditGuiderRequestMode && (
                <>
                  {t("user-feature.profile")}{" "}
                  {(verified ? currentUser?.username : loggedUser?.username) ||
                    t("general.user")}{" "}
                </>
              )}
              {isEditMode && <>{t("user-feature.profile-settings")}</>}
              {isEditGuiderRequestMode && (
                <>{t("request-feature.guider-form")}</>
              )}
            </h1>
            <div>
              {authState && currentUser?.id === loggedUser?.id && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li
                      className="me-2"
                      onClick={() => {
                        setIsEditMode(false);
                        setIsEditVendorRequestMode(false);
                        setIsEditGuiderRequestMode(false);
                      }}
                    >
                      <div
                        className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                          !isEditMode &&
                          !isEditGuiderRequestMode &&
                          !isEditVendorRequestMode &&
                          "text-bluerose-500600 border-b-4 border-rose-500 rounded-t-lg active dark:text-rose-500 dark:border-rose-500 "
                        }`}
                      >
                        <CgProfile
                          className={`${
                            !isEditMode &&
                            !isEditGuiderRequestMode &&
                            !isEditVendorRequestMode &&
                            "text-rose-500"
                          } text-xl mr-2`}
                        />
                        {t("user-feature.view-profile")}
                      </div>
                    </li>
                    <li
                      className="me-2"
                      onClick={() => {
                        setIsEditMode(true);
                        setIsEditGuiderRequestMode(false);
                        setIsEditVendorRequestMode(false);
                      }}
                    >
                      <div
                        className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                          isEditMode &&
                          "text-bluerose-500600 border-b-4 border-rose-500 rounded-t-lg active dark:text-rose-500 dark:border-rose-500 "
                        }`}
                      >
                        <FaUserEdit
                          className={`${
                            isEditMode && "text-rose-500"
                          } text-xl mr-2`}
                        />
                        {t("user-feature.edit-profile")}
                      </div>
                    </li>
                    {(role === Role.User || role === Role.Guider) &&
                      currentGuiderRequestData &&
                      !isEmpty(currentGuiderRequestData) && (
                        <li
                          className="me-2"
                          onClick={() => {
                            setIsEditMode(false);
                            setIsEditVendorRequestMode(false);
                            setIsEditGuiderRequestMode(true);
                          }}
                        >
                          <div
                            className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                              isEditGuiderRequestMode &&
                              "text-bluerose-500600 border-b-4 border-rose-500 rounded-t-lg active dark:text-rose-500 dark:border-rose-500 "
                            }`}
                          >
                            <MdModeOfTravel
                              className={`${
                                isEditGuiderRequestMode && "text-rose-500"
                              } text-xl mr-2`}
                            />
                            {t("user-feature.become-a-guider")}
                          </div>
                        </li>
                      )}
                    {(role === Role.User || role === Role.Vendor) &&
                      currentVendorRequestData &&
                      !isEmpty(currentVendorRequestData) && (
                        <li
                          className="me-2"
                          onClick={() => {
                            setIsEditMode(false);
                            setIsEditVendorRequestMode(false);
                            setIsEditVendorRequestMode(true);
                          }}
                        >
                          <div
                            className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                              isEditVendorRequestMode &&
                              "text-bluerose-500600 border-b-4 border-rose-500 rounded-t-lg active dark:text-rose-500 dark:border-rose-500 "
                            }`}
                          >
                            <TbHomeCog
                              className={`${
                                isEditVendorRequestMode && "text-rose-500"
                              } text-xl mr-2`}
                            />
                            {t("user-feature.become-a-vendor")}
                          </div>
                        </li>
                      )}
                  </ul>
                </div>
              )}
            </div>

            {/* Xem hồ sơ cá nhân */}
            {isEditMode && (
              <>
                <h1 className="text-2xl font-bold my-3"></h1>
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
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-6">
                    <Button
                      outline
                      label={t("general.cancel")}
                      onClick={() => {
                        reset();
                        setIsEditMode(false);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-6">
                    <Button
                      disabled={isLoading}
                      label={t("general.save")}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Điều chỉnh hồ sơ cá nhân */}
            {!isEditMode &&
              !isEditGuiderRequestMode &&
              !isEditVendorRequestMode && (
                <div className="flex flex-col justify-start items-start">
                  {loggedUser || (currentUser && !isLoading) ? (
                    <>
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-start items-center space-x-3">
                          <AiOutlineUser size={18} />
                          <p className="text-md">
                            {t("general.fullname")}:{" "}
                            {verified
                              ? currentUser?.full_name
                              : loggedUser?.full_name || "-"}
                          </p>
                        </div>
                        <div className="flex justify-start items-center space-x-3">
                          <AiOutlineMail size={18} />
                          <p className="text-md">
                            {t("general.email")}:{" "}
                            {verified
                              ? currentUser?.email
                              : loggedUser?.email || "-"}
                          </p>
                        </div>
                        <div className="flex justify-start items-center space-x-3">
                          <AiOutlinePhone size={18} />
                          <p className="text-md">
                            {t("general.phone")}:{" "}
                            {verified
                              ? currentUser?.phone
                              : loggedUser?.phone || "-"}
                          </p>
                        </div>
                        <div className="flex justify-start items-center space-x-3">
                          <MdOutlineDateRange size={18} />
                          <p className="text-md">
                            {t("general.dob")}:{" "}
                            {verified
                              ? currentUser?.dob
                              : loggedUser?.dob || "-"}
                          </p>
                        </div>
                        <div className="flex justify-start items-center space-x-3">
                          <FaRegAddressCard size={18} />
                          <p className="text-md">
                            {t("general.address")}:{" "}
                            {verified
                              ? currentUser?.address
                              : loggedUser?.address || "-"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`space-y-3 pb-4 my-4 w-full ${
                          role === Role.Vendor ? "border-b-[1px]" : ""
                        }`}
                      >
                        <h1 className="text-xl font-bold mt-[32px]">
                          {t("user-feature.about")}{" "}
                          {verified && currentUser
                            ? getUserName(currentUser)
                            : loggedUser
                            ? getUserName(loggedUser)
                            : t("general.user")}
                        </h1>
                        <div className="border border-solid rounded-[24px] w-full p-6">
                          <p
                            className="line-clamp-5 text-ellipsis"
                            aria-rowspan={5}
                          >
                            {verified
                              ? currentUser?.bio
                              : loggedUser?.bio || "-"}
                          </p>
                        </div>
                      </div>
                      {loggedUser &&
                        (role === Role.Vendor || role === Role.Guider) && (
                          <>
                            <div className="w-full">
                              {ratings && ratings.length > 0 && (
                                <div className="flex justify-between items-center w-full">
                                  <h1 className="text-xl font-bold space-y-3">
                                    {t("user-feature.receive-comments")}
                                  </h1>
                                  {ratings && ratings.length > 0 && (
                                    <button
                                      className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                                      onClick={() => commentsModal.onOpen(role)}
                                    >
                                      {t("general.show-more-comments")}
                                    </button>
                                  )}
                                </div>
                              )}
                              <div className="vendor-room-places flex w-full space-x-4 mt-3 justify-start items-start">
                                {!isLoading ? (
                                  <>
                                    {ratings && ratings.length > 0 ? (
                                      ratings
                                        .slice(0, 2)
                                        .map((rating, index) => (
                                          <div
                                            key={index}
                                            className="w-1/2 p-2 space-y-6 border-[1px] rounded-xl"
                                          >
                                            <p className="line-clamp-5 text-ellipsis">{`"...${
                                              rating.DataRating.content || "-"
                                            }"`}</p>
                                            <div className="flex justify-start items-start space-x-6">
                                              <div>
                                                <Image
                                                  width={40}
                                                  height={40}
                                                  src={
                                                    rating.user?.avatar ||
                                                    emptyAvatar
                                                  }
                                                  alt="Avatar"
                                                  className="rounded-full h-[40px] w-[40px]"
                                                  priority
                                                />
                                                <div className="flex space-x-1 justify-center items-center">
                                                  <FaStar size={16} />
                                                  <span className="text-lg">
                                                    {rating?.DataRating
                                                      ?.rating || 0}
                                                  </span>
                                                </div>
                                              </div>
                                              <div>
                                                <h1 className="text-md font-bold space-y-3">
                                                  {rating?.user
                                                    ? getUserName(rating.user)
                                                    : "User"}
                                                </h1>
                                                <p>
                                                  {dayjs(
                                                    rating.DataRating.created_at
                                                  ).format(
                                                    formatDateTimeType.DMY_HMS
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                    ) : (
                                      <div className="text-center text-xl font-bold">
                                        {t("general.no-comment-to-display")}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <Loader />
                                )}
                              </div>
                            </div>
                            <div className="w-full mt-4 border-t-[1px] flex flex-col justify-center items-center">
                              {!isLoading ? (
                                <>
                                  {role === Role.Vendor
                                    ? places &&
                                      places.length > 0 && (
                                        <>
                                          <div className="mt-4 flex justify-between items-center w-full">
                                            <h1 className="text-xl font-bold space-y-3">
                                              {t("general.rooms")}
                                            </h1>
                                            {places.length > 3 && (
                                              <button
                                                className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                                                onClick={roomsModal.onOpen}
                                              >
                                                {t("general.show-more-rooms")}
                                              </button>
                                            )}
                                          </div>
                                          <div className="vendor-room-places flex w-full mt-2">
                                            {places.slice(0, 3).map((list) => (
                                              <div
                                                key={list.id}
                                                className="w-1/3 p-4"
                                              >
                                                <ListingCard
                                                  data={list}
                                                  currentUser={currentUser}
                                                  shrink={true}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )
                                    : role === Role.Guider &&
                                      post &&
                                      post.length > 0 && (
                                        <>
                                          <div className="mt-4 flex justify-between items-center w-full">
                                            <h1 className="text-xl font-bold space-y-3">
                                              {t(
                                                "post-guider-feature.post-guiders"
                                              )}
                                            </h1>
                                            {post.length > 3 && (
                                              <button
                                                className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                                                onClick={roomsModal.onOpen}
                                              >
                                                {t(
                                                  "user-feature.show-more-post"
                                                )}
                                              </button>
                                            )}
                                          </div>
                                          <div className="vendor-room-places flex w-full mt-2">
                                            {post.slice(0, 3).map((post) => (
                                              <div
                                                key={post.id}
                                                className="w-1/3 p-4"
                                              >
                                                <PostGuiderCardVertical
                                                  data={post}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                </>
                              ) : (
                                <Loader />
                              )}
                            </div>
                          </>
                        )}
                    </>
                  ) : (
                    <>
                      <p className="text-lg max-w-[60%]">
                        {t("user-feature.profile-desc")}
                      </p>
                      <div className="col-span-6 mt-4">
                        <Button
                          disabled={isLoading}
                          label={t("user-feature.create-profile")}
                          onClick={() => setIsEditMode(true)}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

            {/* Điều chỉnh form trở thành Hướng dẫn viên */}
            {isEditGuiderRequestMode && (
              <>
                <Input
                  id="full_name"
                  label={t("general.fullname")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  required
                />
                <Input
                  id="username"
                  label={t("general.username")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  required
                />
                <Input
                  id="email"
                  label="E-mail"
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  required
                  type="email"
                />
                <Input
                  id="phone"
                  label={t("general.phone")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  type="tel"
                  required
                />
                <Input
                  id="dob"
                  label={t("general.dob")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  type="date"
                  required
                />
                <Input
                  id="address"
                  label={t("general.address")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                />
                <MultiSelection
                  tags={languages.map((lang) => lang.name)}
                  title={t("request-feature.your-languages")}
                  selected={selectedLanguages}
                  setSelected={setSelectedLanguages}
                />
                <MultiSelection
                  tags={post_guider_types.map((post) => post.name)}
                  title={t("request-feature.goals-of-travel")}
                  selected={selectedGoals}
                  setSelected={setSelectedGoals}
                />
                <Input
                  id="description"
                  label={t("general.description")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                />
                <Input
                  id="experience"
                  label={t("request-feature.show-experience")}
                  disabled={isLoading}
                  register={register2}
                  errors={errors2}
                  required
                />
                <Input
                  id="reason"
                  label={t("request-feature.why-become-guider")}
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
                      onClick={handleSubmit2(onSubmit2)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Điều chỉnh form trở thành Chủ nhà */}
            {isEditVendorRequestMode && (
              <>
                <Input
                  id="full_name"
                  label={t("general.fullname")}
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                  required
                />
                <Input
                  id="username"
                  label={t("general.username")}
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                  required
                />
                <Input
                  id="email"
                  label="E-mail"
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                  required
                  type="email"
                />
                <Input
                  id="phone"
                  label={t("general.phone")}
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                  type="tel"
                  required
                />
                <Input
                  id="dob"
                  label={t("general.dob")}
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                  type="date"
                  required
                />
                <Input
                  id="address"
                  label={t("general.address")}
                  disabled={isLoading}
                  register={register3}
                  errors={errors3}
                />
                <div className="relative">
                  <textarea
                    id="description"
                    className={`peer resize-none border-2 border-solid py-10 px-4 rounded-md w-full focus:outline-none
          ${!description ? "border-rose-500" : "border-neutral-300"} ${
                      !description
                        ? "focus:border-rose-500"
                        : "focus:outline-none"
                    }
          `}
                    value={description}
                    onInput={(e) =>
                      handleTextareaInput(
                        e as React.ChangeEvent<HTMLTextAreaElement>,
                        "description"
                      )
                    }
                    onChange={(e) => handleTextareaInput(e, "description")}
                    rows={8}
                  ></textarea>
                  <label
                    className={`left-4 absolute text-md duration-150 transform -translate-y-3 top-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                      !description ? "text-rose-500" : "text-zinc-400"
                    }`}
                  >
                    Describe your services
                  </label>
                  {!description && (
                    <label className="font-sm text-rose-500">
                      {`Description ${t("form-validation.is-required")}`}
                    </label>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    id="experience"
                    className={`peer resize-none border-2 border-solid py-10 px-4 rounded-md w-full focus:outline-none
          ${!experience ? "border-rose-500" : "border-neutral-300"} ${
                      !experience
                        ? "focus:border-rose-500"
                        : "focus:outline-none"
                    }
          `}
                    value={experience}
                    onInput={(e) =>
                      handleTextareaInput(
                        e as React.ChangeEvent<HTMLTextAreaElement>,
                        "experience"
                      )
                    }
                    onChange={(e) => handleTextareaInput(e, "experience")}
                    rows={8}
                  ></textarea>
                  <label
                    className={`left-4 absolute text-md duration-150 transform -translate-y-3 top-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                      !experience ? "text-rose-500" : "text-zinc-400"
                    }`}
                  >
                    Show us your experience
                  </label>
                  {!experience && (
                    <label className="font-sm text-rose-500">
                      {`Experience ${t("form-validation.is-required")}`}
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-6">
                    <Button
                      outline
                      label={t("general.cancel")}
                      onClick={() => {
                        reset3();
                        setIsEditVendorRequestMode(false);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-span-6">
                    <Button
                      disabled={
                        isLoading ||
                        (currentVendorRequestData &&
                          (currentVendorRequestData as Vendor).status &&
                          (currentVendorRequestData as Vendor).status !==
                            BecomeGuiderStatus.Processing)
                      }
                      label={t("general.save")}
                      onClick={handleSubmit3(onSubmit3)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClient;
