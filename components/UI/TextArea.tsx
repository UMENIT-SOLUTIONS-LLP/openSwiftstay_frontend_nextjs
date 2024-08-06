import classNames from "classnames";
import React from "react";
import { Controller } from "react-hook-form";

export default function TextArea({
  name,
  placeholder,
  control,
  errors,
  rules,
  disabled,
  labelClassName,
  className,
  label,
  rows,
  leftIcon,
  rightIcon,
}: any) {
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
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {leftIcon}
              </div>
            )}
            <textarea
              className={classNames(
                "w-full appearance-none rounded-lg border text-black border-stroke bg-white py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none",
                className
              )}
              aria-invalid={errors && errors[name] ? "true" : "false"}
              aria-describedby={`${name}Error`}
              placeholder={placeholder}
              onChange={(e) => {
                onChange(e);
              }}
              onBlur={onBlur}
              value={value || ""}
              disabled={disabled}
              autoComplete="off"
              aria-autocomplete="none"
              rows={rows}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {rightIcon}
              </div>
            )}
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
