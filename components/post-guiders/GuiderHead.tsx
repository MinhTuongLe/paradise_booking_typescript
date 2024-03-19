"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import { AiOutlineShareAlt } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@/store/store";
import { MdConnectedTv } from "react-icons/md";
import { FaStar } from "react-icons/fa";

interface GuiderHeadProps {
  title: string;
  locationValue: any;
  imageSrc: string;
  id: number;
  isFree: boolean;
}

const GuiderHead: React.FC<GuiderHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  isFree,
}) => {
  const currentUrl = window.location.href;
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Copy successfully");
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-2 font-bold text-md">
        <MdConnectedTv size={18} />
        <span className="text-sm">ONLINE EXPERIENCE</span>
      </div>
      <div className="flex justify-between items-end mb-1">
        <Heading title={title} isGuider={true} />
      </div>
      <div className="flex justify-between items-end mb-8">
        <div className="flex justify-between items-end gap-6">
          <div className="flex space-x-1 justify-between items-center">
            <FaStar size={14} />
            <span className="text-sm font-semibold">{5.0} </span>
            <span className="text-sm">(16)</span>
          </div>
          <span className="underline font-bold text-sm">Tokyo, Japan</span>
        </div>
        <div className="flex justify-between items-end gap-6">
          <div
            className="flex items-center justify-between cursor-pointer hover:text-rose-500"
            onClick={handleCopyToClipboard}
          >
            <AiOutlineShareAlt />
            <span className="text-[16px] ml-2 underline">Share</span>
          </div>
          {loggedUser?.role !== 3 && (
            <div className="">
              <HeartButton listingId={id} isFree={isFree} />
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-6 w-full h-[60vh] overflow-hidden rounded-xl relative"
        >
          <Image
            src={imageSrc}
            alt="image"
            fill
            className="object-cover w-full"
          />
          <div className="row-span-1">
            <div className="grid grid-cols-12 gap-8 w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
                <div className="absolute top-5 right-5">
                  <HeartButton listingId={id} isFree={isFree} />
                </div>
              </motion.div>
            </div>
            <div className="grid grid-cols-12 gap-8 w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
              >
                <Image
                  src={imageSrc}
                  alt="image"
                  fill
                  className="object-cover w-full"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="col-span-6 h-[60vh]">
          <div className="grid grid-rows-2 h-[60vh] gap-4">
            <div className="row-span-1">
              <div className="grid grid-cols-12 gap-4 w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
              </div>
            </div>
            <div className="row-span-1">
              <div className="grid grid-cols-12 gap-4 w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="col-span-6 w-full h-full overflow-hidden rounded-xl relative"
                >
                  <Image
                    src={imageSrc}
                    alt="image"
                    fill
                    className="object-cover w-full"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuiderHead;
