/* eslint-disable react/no-children-prop */
"use client";

import Avatar from "@/components/Avatar";
import Notification from "@/components/Notification";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import Input from "@/components/inputs/Input";
import FormItem from "@/components/inputs/FormItem";
import ListingCard from "@/components/listing/ListingCard";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";

function NotificationClient() {
  // const router = useRouter();

  // const [isLoading, setIsLoading] = useState(false);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     username: "",
  //     name: "",
  //     avatar: "",
  //     address: "",
  //     phone: "",
  //     dob: "",
  //     email: "",
  //   },
  // });

  return (
    <div className="max-w-[992px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-8">
          <h1 className="text-2xl font-bold my-3">Notifications</h1>
          <div className="space-y-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
            <Notification
              id={1}
              content={
                "Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất Thông báo từ Lê Minh Tường mới nhất "
              }
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
            <Notification
              id={1}
              content={"Thông báo từ Lê Minh Tường mới nhất"}
              avatar=""
              date={"11/11/2011"}
              closeIcon={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationClient;
