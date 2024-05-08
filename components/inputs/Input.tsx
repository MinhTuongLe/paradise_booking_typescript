// Import necessary dependencies
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdPricetags } from "react-icons/io";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  register?: any;
  required?: boolean;
  errors?: any;
  dob?: boolean;
  watchFunc?: any;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  dob,
  watchFunc,
}) => {
  const { t } = useTranslation("translation", { i18n });

  const [showPassword, setShowPassword] = useState(false);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phonePattern = /^\d{10}$/;
  const numberPattern = /[0-9]+/;
  const maxDate = dob ? new Date().toISOString().split("T")[0] : null;

  const options: any = {
    email: {
      required: `${label} ${t("form-validation.is-required")}`,
      pattern: {
        value: emailPattern,
        message: `${label} ${t("form-validation.invalid")}`,
      },
    },
    tel: {
      required: `${label} ${t("form-validation.is-required")}`,
      pattern: {
        value: phonePattern,
        message: `${label} ${t("form-validation.invalid")}`,
      },
    },
    number: {
      required: `${label} ${t("form-validation.is-required")}`,
      pattern: {
        value: numberPattern,
        message: `${label} ${t("form-validation.invalid")}`,
      },
    },
    date: dob
      ? {
          required: `${label} ${t("form-validation.is-required")}`,
          pattern: {
            value: new RegExp(`^\\d{4}-\\d{2}-\\d{2}$|^(?!${maxDate})`),
            message: `${label} ${t("form-validation.invalid")}`,
          },
        }
      : {},
    password: ["confirmed_password", "confirmPassword"].includes(id)
      ? {
          required: `${label} ${t("form-validation.is-required")}`,
          validate: (val: string) => {
            if (watchFunc && watchFunc != val) {
              return t("toast.passwords-not-match");
            }
          },
          minLength: {
            value: 6,
            message: `${label} ${t("form-validation.min-password-characters")}`,
          },
          maxLength: {
            value: 256,
            message: `${label} ${t("form-validation.max-password-characters")}`,
          },
        }
      : {
          required: `${label} ${t("form-validation.is-required")}`,
          minLength: {
            value: 6,
            message: `${label} ${t("form-validation.min-password-characters")}`,
          },
          maxLength: {
            value: 256,
            message: `${label} ${t("form-validation.max-password-characters")}`,
          },
          validate: (val: string) => {
            if (id === "new_password" && watchFunc && watchFunc == val) {
              return t("form-validation.diff-password");
            }
          },
        },
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full relative">
      {formatPrice && (
        <IoMdPricetags
          size={22}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(
          id,
          options[type] || {
            required:
              required && `${label} ${t("form-validation.is-required")}`,
          }
        )}
        // placeholder=" "
        type={showPassword ? "text" : type}
        className={`peer w-full ${
          label ? "p-4 pt-6" : "p-1"
        } font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
          formatPrice ? "pl-9" : "pl-4"
        } ${errors[id] ? "border-rose-500" : "border-neutral-300"} ${
          errors[id] ? "focus:border-rose-500" : "focus:outline-none"
        }`}
        // min={type === "number" ? 0 : null}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        //   if (type === "number") {
        //     if (pattern && !new RegExp(pattern).test(e.target.value)) {
        //       e.target.value = "0";
        //     }
        //   } else if (type === "date" && dob) {
        //     const currentDate = new Date().toISOString().split("T")[0];
        //     if (e.target.value > currentDate) {
        //       e.target.value = currentDate;
        //     }
        //   }
        // }}
      />

      {label && (
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 ${
            formatPrice ? "left-9" : "left-4"
          } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
            errors[id] ? "text-rose-500" : "text-zinc-400"
          }`}
        >
          {label} {formatPrice && <span className="text-xs">(VND)</span>}
        </label>
      )}

      <label className="font-sm text-rose-500">
        {errors[id] && errors[id].message}
      </label>

      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-5 right-2 cursor-pointer focus:outline-none"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="text-[24px] text-zinc-400" />
          ) : (
            <AiOutlineEye className="text-[24px] text-zinc-400" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
