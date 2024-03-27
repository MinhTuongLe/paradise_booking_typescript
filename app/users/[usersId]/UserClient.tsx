/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
"use client";

import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { FaCheck, FaFlag, FaRegAddressCard, FaStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { IoBriefcaseOutline } from "react-icons/io5";

import Avatar from "@/components/Avatar";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Input from "@/components/inputs/Input";
import FormItem from "@/components/inputs/FormItem";
import ListingCard from "@/components/listing/ListingCard";
import Button from "@/components/Button";
import ImageUpload from "@/components/inputs/ImageUpload";
import "../../../styles/globals.css";
import { API_URL, emptyAvatar } from "@/const";
import useCommentsModal from "@/hook/useCommentsModal";
import useRoomsModal from "@/hook/useRoomsModal";
import useReportModal from "@/hook/useReportModal";
import useBecomeVendorModal from "@/hook/useBecomeVendorModal";
import { setLoggUser } from "@/components/slice/authSlice";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import { Place, Rating } from "@/models/place";
import { User } from "@/models/user";
import { UserClientDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";

export interface UserClientProps {
  places: Place[];
  currentUser: User | undefined;
  role: number;
}

const UserClient: React.FC<UserClientProps> = ({
  places,
  currentUser,
  role,
}) => {
  const reportModal = useReportModal();
  const commentsModal = useCommentsModal();
  const roomsModal = useRoomsModal();
  const becomeVendorModal = useBecomeVendorModal();
  const dispatch = useDispatch();
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const verified = currentUser?.id !== loggedUser?.id && role === 2;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVendor, setIsVendor] = useState(loggedUser?.role === 2);
  const [ratings, setRatings] = useState<Rating[]>([]);

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

  const handleFileUpload = async (file: File) => {
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
      };

      axios
        .patch(`${API_URL}/account/${currentUser?.id}`, submitValues, config)
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
          toast.success("Update Profile Successfully");
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
          setIsLoading(false);
        });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBecomeVendor = () => {
    becomeVendorModal.onOpen();
  };

  const getRatings = async () => {
    setIsLoading(true);

    await axios
      .get(`${API_URL}/booking_ratings/vendors/${currentUser?.id}`)
      .then((response) => {
        setRatings(response.data.data.ListRating);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getRatings();
  }, []);

  // if (!loggedUser && currentUser.role !== 2) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }

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
                <span className="text-xl">User</span>
              </>
            )}
          </div>
          <>
            {isEditMode ? (
              <>
                <h1 className="text-xl font-bold my-3">Your Bio</h1>
                <textarea
                  className="resize-none border border-solid p-8 rounded-[24px] w-full focus:outline-none"
                  rows={5}
                  placeholder="Add your bio here ..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </>
            ) : (
              <>
                <div className="mt-12 p-8 rounded-[24px] border-[1px] border-[#cdcdcd]">
                  <h1 className="text-xl font-bold mb-3">
                    {currentUser?.id !== loggedUser?.id
                      ? currentUser?.full_name
                        ? currentUser.full_name
                        : currentUser?.username
                      : "Your"}{" "}
                    verified Information
                  </h1>
                  <div className="flex items-center space-x-4 mb-4 mt-4">
                    <FaCheck className="text-[16px]" />
                    {/* <IoClose className="text-[28px] font-bold" /> */}
                    <span>Email Verification</span>
                  </div>
                  <div
                    className={`flex items-center space-x-4 ${
                      currentUser?.id === loggedUser?.id && role === 1 && "mb-8"
                    } mt-4`}
                  >
                    <FaCheck className="text-[16px]" />
                    {/* <IoClose className="text-[28px] font-bold" /> */}
                    <span>Profile Verification</span>
                  </div>
                  {currentUser?.id === loggedUser?.id && role === 1 && (
                    <>
                      <hr />
                      <div className="my-8">
                        You need to verify the above information if you want to
                        start listing your place for rent.
                      </div>
                      <Button
                        disabled={isVendor}
                        outline={isVendor}
                        label="Become A Vendor"
                        onClick={handleSubmit(handleBecomeVendor)}
                      />
                    </>
                  )}
                </div>
                {verified && (
                  <div className="w-full flex justify-center items-start mt-6">
                    <div
                      className="flex justify-center items-center gap-4 cursor-pointer"
                      onClick={reportModal.onOpen}
                    >
                      <FaFlag size={16} />
                      <span className="underline">Report this vendor</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </div>
        <div className="sm:col-span-12 lg:col-span-8">
          <div className="px-8 pb-8 space-y-6">
            {isEditMode ? (
              <>
                <h1 className="text-2xl font-bold my-3">Profile Settings</h1>
                <Input
                  id="full_name"
                  label="Name"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                />
                <Input
                  id="username"
                  label="Username"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                />
                {/* <Input
                  id="email"
                  label="Email"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                  type="email"
                /> */}
                <Input
                  id="phone"
                  label="Phone Number"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  type="tel"
                />
                <Input
                  id="dob"
                  label="Date of Birth"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  type="date"
                  dob={true}
                />
                <Input
                  id="address"
                  label="Address"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                />
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-6">
                    <Button
                      outline
                      label="Cancel"
                      onClick={() => {
                        reset();
                        setIsEditMode(false);
                      }}
                    />
                  </div>
                  <div className="col-span-6">
                    <Button
                      disabled={isLoading}
                      label="Save"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-start items-start">
                {loggedUser || (currentUser && !isLoading) ? (
                  <>
                    <h1 className="text-2xl font-bold">
                      {(verified
                        ? currentUser?.username
                        : loggedUser?.username) || "User"}{" "}
                      Profile
                    </h1>
                    {authState && currentUser?.id === loggedUser?.id && (
                      <button
                        className="mt-6 px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit profile
                      </button>
                    )}
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-start items-center space-x-3">
                        <AiOutlineUser size={18} />
                        <p className="text-md">
                          Name:{" "}
                          {verified
                            ? currentUser?.full_name
                            : loggedUser?.full_name || "-"}
                        </p>
                      </div>
                      <div className="flex justify-start items-center space-x-3">
                        <AiOutlineMail size={18} />
                        <p className="text-md">
                          Email:{" "}
                          {verified
                            ? currentUser?.email
                            : loggedUser?.email || "-"}
                        </p>
                      </div>
                      <div className="flex justify-start items-center space-x-3">
                        <AiOutlinePhone size={18} />
                        <p className="text-md">
                          Phone:{" "}
                          {verified
                            ? currentUser?.phone
                            : loggedUser?.phone || "-"}
                        </p>
                      </div>
                      <div className="flex justify-start items-center space-x-3">
                        <MdOutlineDateRange size={18} />
                        <p className="text-md">
                          Date of Birth:{" "}
                          {verified ? currentUser?.dob : loggedUser?.dob || "-"}
                        </p>
                      </div>
                      <div className="flex justify-start items-center space-x-3">
                        <FaRegAddressCard size={18} />
                        <p className="text-md">
                          Address:{" "}
                          {verified
                            ? currentUser?.address
                            : loggedUser?.address || "-"}
                        </p>
                      </div>
                      {/* <div className="flex justify-start items-center space-x-3">
                        <IoBriefcaseOutline size={18} />
                        <p className="text-md">Job: Developer</p>
                      </div> */}
                    </div>
                    <div
                      className={`space-y-3 pb-4 my-4 w-full ${
                        role === 2 ? "border-b-[1px]" : ""
                      }`}
                    >
                      <h1 className="text-xl font-bold mt-[32px]">
                        About{" "}
                        {verified
                          ? currentUser?.full_name
                          : loggedUser?.full_name || "user"}
                      </h1>
                      <div className="border border-solid rounded-[24px] w-full p-6">
                        <p
                          className="line-clamp-5 text-ellipsis"
                          aria-rowspan={5}
                          placeholder="Add your bio here ..."
                        >
                          {verified ? currentUser?.bio : loggedUser?.bio || "-"}
                        </p>
                      </div>
                    </div>
                    {loggedUser && role === 2 && (
                      <>
                        <div className="w-full">
                          {ratings && ratings.length > 2 && (
                            <div className="flex justify-between items-center w-full">
                              <h1 className="text-xl font-bold space-y-3">
                                {currentUser?.full_name ||
                                  currentUser?.username ||
                                  "Vendor"}
                                's Comments
                              </h1>
                              {ratings && ratings.length > 0 && (
                                <button
                                  className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                                  onClick={commentsModal.onOpen}
                                >
                                  Show more comments
                                </button>
                              )}
                            </div>
                          )}
                          <div className="vendor-room-places flex w-full space-x-4 mt-3 justify-start items-center">
                            {!isLoading ? (
                              <>
                                {ratings && ratings.length > 0 ? (
                                  ratings.slice(0, 2).map((rating, index) => (
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
                                              rating.user?.avatar || emptyAvatar
                                            }
                                            alt="Avatar"
                                            className="rounded-full h-[40px] w-[40px]"
                                            priority
                                          />
                                          <div className="flex space-x-2 justify-between items-center">
                                            <FaStar size={16} />
                                            <span className="text-lg">
                                              {rating?.DataRating?.rating || 0}
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <h1 className="text-md font-bold space-y-3">
                                            {rating.user?.full_name ||
                                              rating.user?.username ||
                                              rating.user?.email ||
                                              "-"}
                                          </h1>
                                          <p>
                                            {rating.DataRating.created_at
                                              .split("T")[0]
                                              .split("-")
                                              .reverse()
                                              .join("-") || "-"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center text-xl font-bold">
                                    No comment to display
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
                              {places && places.length > 0 && (
                                <>
                                  <div className="mt-4 flex justify-between items-center w-full">
                                    <h1 className="text-xl font-bold space-y-3">
                                      {currentUser?.full_name ||
                                        currentUser?.username ||
                                        "Vendor"}
                                      's Rooms
                                    </h1>
                                    {places.length > 3 && (
                                      <button
                                        className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
                                        onClick={roomsModal.onOpen}
                                      >
                                        Show more rooms
                                      </button>
                                    )}
                                  </div>
                                  <div className="vendor-room-places flex w-full mt-2">
                                    {places.slice(0, 3).map((list) => (
                                      <div key={list.id} className="w-1/3 p-4">
                                        <ListingCard
                                          data={list}
                                          currentUser={currentUser}
                                          shrink={true}
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
                      Your Paradise profile is an important part of every
                      booking/reservation. Create a profile to help other
                      Hosts/Hosts and guests learn about you.
                    </p>
                    <div className="col-span-6 mt-4">
                      <Button
                        disabled={isLoading}
                        label="Create profile"
                        onClick={() => setIsEditMode(true)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClient;
