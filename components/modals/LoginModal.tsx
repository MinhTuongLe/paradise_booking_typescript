"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";

import { loadGapiInsideDOM } from "gapi-script";
import GoogleLogin from "react-google-login";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useForgotPasswordModal from "@/hook/useForgotPasswordModal";
import { setLoggUser, setAuthState } from "@/components/slice/authSlice";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { API_URL } from "@/const";
import { LoginModal } from "@/models/modal";
import "../../styles/globals.css";

function LoginModal({}) {
  const router = useRouter();
  const pathName = usePathname();

  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const forgotPasswordModel = useForgotPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginModal) => {
    setIsLoading(true);
    axios.defaults.headers.post["Content-Type"] = "application/json";

    axios
      .post(`${API_URL}/login`, data)
      .then((callback) => {
        toast.success("Login Successfully");
        Cookie.set("accessToken", callback.data.accessToken, {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        Cookie.set("expiresAt", callback.data.expiresAt, {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        Cookie.set("loginType", "1", {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        dispatch(setAuthState(true));
        setIsLoading(false);
        reset();
        router.refresh();
        loginModel.onClose();

        const config = {
          params: {
            email: data.email,
          },
        };
        axios
          .get(`${API_URL}/profile`, config)
          .then((callback) => {
            dispatch(setLoggUser(callback.data.data));
            Cookie.set("userId", callback.data.data.id, {
              expires: 1 / 2,
              secure: false,
              sameSite: "lax",
            });
            Cookie.set("user_email", data.email, {
              expires: 1 / 2,
              secure: false,
              sameSite: "lax",
            });
          })
          .catch((err) => {
            toast.error("Get user information failed");
            setIsLoading(false);
          });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error?.message || err?.response?.data?.message
        );
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    loginModel.onClose();
    registerModel.onOpen();
  }, [loginModel, registerModel]);

  const toggleForgotPasswordModal = useCallback(() => {
    loginModel.onClose();
    forgotPasswordModel.onOpen();
  }, [loginModel, forgotPasswordModel]);

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };
  const onSuccess = async (res: any) => {
    // console.log("LOGIN SUCCESS: ", res.profileObj);
    const submitValues = {
      email: res.profileObj.email,
      full_name: res.profileObj.name,
      avatar: res.profileObj.imageUrl,
      type: 2,
    };

    axios
      .post(`${API_URL}/login`, submitValues)
      .then((callback) => {
        toast.success("Login Successfully");
        Cookie.set("accessToken", callback.data.accessToken, {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        Cookie.set("expiresAt", callback.data.expiresAt, {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        Cookie.set("loginType", "2", {
          expires: 1 / 2,
          secure: false,
          sameSite: "lax",
        });
        dispatch(setAuthState(true));
        setIsLoading(false);
        reset();
        router.refresh();
        loginModel.onClose();
        const config = {
          params: {
            email: res.profileObj.email,
          },
        };
        axios
          .get(`${API_URL}/profile`, config)
          .then((callback) => {
            dispatch(setLoggUser(callback.data.data));
            Cookie.set("userId", callback.data.data.id, {
              expires: 1 / 2,
              secure: false,
              sameSite: "lax",
            });
            Cookie.set("user_email", res.profileObj.email, {
              expires: 1 / 2,
              secure: false,
              sameSite: "lax",
            });
          })
          .catch((err) => {
            toast.error("Get user information failed");
            setIsLoading(false);
          });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error?.message || err?.response?.data?.message
        );
        setIsLoading(false);
      });
  };

  const onFailure = async () => {
    toast.error("Login failed with Google");
    loginModel.onClose();
  };

  useEffect(() => {
    if (loginModel.isOpen)
      (async () => {
        await loadGapiInsideDOM();
      })();
  }, [loginModel.isOpen]);

  const bodyContent = (
    <div className="flex flex-col gap-4" onKeyDown={onKeyPress}>
      <Heading title="Welcome Back" subtitle="Login to your Account!" center />
      <Input
        id="email"
        label="Email Address"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="email"
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <span
        onClick={toggleForgotPasswordModal}
        className="text-neutral-800 cursor-pointer hover:underline text-right "
      >
        Forgot password
      </span>
      <hr />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <GoogleLogin
        clientId={process.env.GOOGLE_OAUTH_CLIENT_ID as string}
        buttonText="Continue with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        className="customLoginGoogle"
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div>
          {`Didn't have an Account?`}{" "}
          <span
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Create an Account
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModel.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      reset={reset}
      classname="md:w-2/3 lg:w-1/2 xl:w-1/3"
    />
  );
}

export default LoginModal;
