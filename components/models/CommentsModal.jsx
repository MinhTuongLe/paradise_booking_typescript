/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import useLoginModel from "@/hook/useLoginModal";
import useCommentsModal from "../../hook/useCommentsModal";
// import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "../Button";
import Heading from "../Heading";
// import Input from "../inputs/Input";
import Modal from "./Modal";
// import { BiDollar } from "react-icons/bi";
import Image from "next/image";
import "../../styles/globals.css";
import { API_URL, emptyAvatar, emptyImage } from "@/const";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "../Loader";
import { FaStar } from "react-icons/fa";

const data = {
  name: "Le Minh Tuong",
  email: "leminhtuong@gmail.com",
  phone: "0834091202",
  dob: "09/12/2002",
  address: "HCM",
  bio: "Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile! Developer in HCM City ~~~ Welcome to my profile!",
};

function CommentsModal({}) {
  const commentsModal = useCommentsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const params = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      setIsLoading(false);
      return;
    }

    const { confirmPassword, ...formData } = data;

    // axios
    //   .post("/api/register", formData)
    //   .then(() => {
    //     toast.success("Success!");
    //     loginModel.onOpen();
    //     commentsModal.onClose();
    //   })
    //   .catch((err) => toast.error("Something Went Wrong"))
    //   .finally(() => {
    //     setIsLoading(false);
    //     toast.success("Register Successfully");
    //   });
  };

  const toggle = useCallback(() => {
    commentsModal.onClose();
  }, [commentsModal]);

  const getRatings = async () => {
    setIsLoading(true);

    await axios
      .get(`${API_URL}/booking_ratings/vendors/${params.usersId}`)
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
    if (commentsModal.isOpen) getRatings();
  }, [commentsModal.isOpen]);

  const bodyContent = (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          {ratings &&
            ratings.length > 0 &&
            ratings.map((rating, index) => (
              <div key={index}>
                <div className="w-full p-2 space-y-1">
                  <div className="w-full flex justify-between items-start">
                    <div className="flex w-[60%] flex-col justify-start items-start space-y-1">
                      <h1 className="text-xl font-bold space-y-3 text-ellipsis line-clamp-1">
                        {rating?.place.name || "-"}
                      </h1>
                      <div className="text-sm font-bold space-y-2 text-ellipsis line-clamp-1">
                        {`${
                          rating?.place.address
                            ? rating?.place.address + ", "
                            : ""
                        } ${rating?.place.district}, ${rating?.place.state}, ${
                          rating?.place.country
                        }`}
                      </div>
                    </div>
                    <div
                      className="w-[20%] flex justify-end items-start cursor-pointer"
                      onClick={() =>
                        window.open(`/listings/${rating?.place.id}`, "_blank")
                      }
                    >
                      <Image
                        width={80}
                        height={60}
                        src={rating?.place.cover || emptyImage}
                        alt="Avatar"
                        className="rounded-xl h-[60px] w-[80px]"
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex justify-start items-start space-x-6">
                    <div>
                      <Image
                        width={40}
                        height={40}
                        src={rating?.user.avatar || emptyAvatar}
                        priority
                        alt="Image"
                        className="rounded-full h-[40px] w-[40px]"
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
                  <p className="line-clamp-5">{`"...${
                    rating.DataRating.content || "-"
                  }"`}</p>
                </div>
                <hr />
              </div>
            ))}
        </div>
      )}
    </>
  );

  const footerContent = (
    <>
      {/* <hr />
      <div className="flex justify-between items-center w-full">
        <button
          className="px-4 py-2 rounded-lg hover:opacity-80 transition bg-white border-black text-black text-sm border-[1px]"
          onClick={commentsModal.onOpen}
        >
          Show more comments
        </button>
      </div> */}
    </>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={commentsModal.isOpen}
      title={`${ratings.length || 0} comments`}
      onClose={commentsModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default CommentsModal;
