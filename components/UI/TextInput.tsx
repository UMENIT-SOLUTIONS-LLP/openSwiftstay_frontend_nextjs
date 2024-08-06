import classNames from "classnames";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function TextInput({
  name,
  stepOff,
  minVal = 0,
  placeholder,
  control,
  errors,
  rules,
  type,
  disabled,
  className,
  labelClassName,
  label,
  leftIcon,
  rightIcon,
}: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full relative">
      <Controller
        render={({ field: { onChange, value, onBlur } }) => (
          <>
            {label && (
              <label
                className={classNames(
                  "mb-2.5 block text-black-2 dark:text-white text-sm",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 flex items-center h-full">
                  {leftIcon}
                </div>
              )}
              <input
                type={type === "number" ? "text" : showPassword ? "text" : type}
                className={classNames(
                  "w-full appearance-none rounded-lg border text-black border-stroke bg-white py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none",
                  className
                )}
                aria-invalid={errors && errors[name] ? "true" : "false"}
                aria-describedby={`${name}Error`}
                placeholder={placeholder}
                onInput={(e: any) => {
                  const inputValue = e.target.value;
                  const decimalCount = (inputValue.match(/\./g) || []).length;
                  if (inputValue < minVal) {
                    e.target.setCustomValidity(`Min val should be ${minVal} `);
                  } else {
                    e.target.setCustomValidity(``);
                  }
                  if (
                    type === "number" &&
                    (decimalCount > 1 ||
                      isNaN(Number(inputValue)) ||
                      (type === "number" && !/^\d*\.?\d*$/.test(inputValue)))
                  ) {
                    e.target.value = inputValue.slice(0, -1);
                  }
                }}
                onChange={(e) => {
                  if (name === "email_id") {
                    const trimmedValue = e.target.value.trim();
                    onChange(trimmedValue);
                  } else {
                    onChange(e);
                  }
                }}
                onBlur={onBlur}
                value={value || ""}
                disabled={disabled}
                autoComplete="off"
                aria-autocomplete="none"
                min={minVal}
                step={stepOff ? "1" : "0.01"}
              />
              {type === "password" && (
                <div
                  className="cursor-pointer absolute right-3 top-0 flex items-center h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowPassword(!showPassword);
                    }
                  }}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
              )}
              {rightIcon && (
                <div className="absolute right-3 top-0 flex items-center h-full">
                  {rightIcon}
                </div>
              )}
            </div>
          </>
        )}
        name={name}
        control={control}
        rules={rules}
      />

      {errors?.[name] && (
        <p className="text-[#f00] text-[12px] text-error">
          <span role="alert" id={`${name}Error`}>
            {errors[name]?.message}
          </span>
        </p>
      )}
    </div>
  );
}
