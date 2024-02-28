/* eslint-disable react/no-children-prop */
"use client";

import Input from "@/components/inputs/Input";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { API_URL } from "@/const";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import EmptyState from "@/components/EmptyState";
import { ChangePasswordDataSubmit } from "@/models/api";
import { RootState } from "@/store/store";

function ChangePasswordClient() {
  const authState = useSelector((state: RootState) => state.authSlice.authState);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirmed_password: "",
    },
  });

  const onSubmit = (data: ChangePasswordDataSubmit) => {
    setIsLoading(true);

    if (data.new_password !== data.confirmed_password) {
      toast.error("Passwords not match");
      setIsLoading(false);
    } else {
      const accessToken = Cookie.get("accessToken");
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const { confirmed_password, ...rest } = data;
      axios
        .post(`${API_URL}/change/password`, rest, config)
        .then(() => {
          setIsLoading(false);
          toast.success("Change password Successfully");
          reset();
        })
        .catch((err) => {
          toast.error("Change password Failed");
          setIsLoading(false);
        });
    }
  };

  if (!authState) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  return (
    <div className="max-w-[768px] mx-auto px-4">
      <div className="mt-10 grid grid-cols-12 gap-8">
        <div className="p-8 col-span-12 space-y-6">
          <h1 className="text-2xl font-bold my-3">Change Password</h1>
          <Input
            id="old_password"
            label="Current Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
          />
          <Input
            id="new_password"
            label="New Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
          />
          <Input
            id="confirmed_password"
            label="Confirmed Password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
          />
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <Button outline label="Cancel" onClick={() => reset()} />
            </div>
            <div className="col-span-6">
              <Button
                disabled={isLoading}
                label="Save"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordClient;
