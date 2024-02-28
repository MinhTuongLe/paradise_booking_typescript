// Import necessary dependencies
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiDollar } from "react-icons/bi";

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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const emailPattern = /^\S+@\S+\.\S+$/;
  const phonePattern = /^\d{10}$/;
  const numberPattern = /[0-9]+/;
  const maxDate = dob ? new Date().toISOString().split("T")[0] : null;

  const pattern: RegExp | null =
    type === "email"
      ? emailPattern
      : type === "tel"
      ? phonePattern
      : type === "number"
      ? numberPattern
      : type === "date" && dob
      ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}$|^(?!${maxDate})`)
      : null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required, pattern })}
        // placeholder=" "
        type={showPassword ? "text" : type}
        className={`peer w-full ${
          label ? "p-4 pt-6" : "p-1"
        } font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
          formatPrice ? "pl-9" : "pl-4"
        } ${errors[id] ? "border-rose-500" : "border-neutral-300"} ${
          errors[id] ? "focus:border-rose-500" : "focus:outline-none"
        }`}
        min={type === "number" ? 0 : null}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (type === "number") {
            if (pattern && !new RegExp(pattern).test(e.target.value)) {
              e.target.value = "0";
            }
          }
          if (type === "date" && dob) {
            const currentDate = new Date().toISOString().split("T")[0];
            if (e.target.value > currentDate) {
              e.target.value = currentDate;
            }
          }
        }}
      />

      {label && (
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 ${
            formatPrice ? "left-9" : "left-4"
          } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
            errors[id] ? "text-rose-500" : "text-zinc-400"
          }`}
        >
          {label}
        </label>
      )}

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
