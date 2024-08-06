import React from "react";
import ReactDatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { MdOutlineCalendarToday } from "react-icons/md";
import Image from "next/image";

export default function DatePickerInput({
  label,
  name,
  control,
  errors,
  placeholder,
  rules,
  externalChangeHandler,
  ...rest
}: any) {
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Controller
        render={({ field: { onChange, value, onBlur } }) => (
          <div className="relative">
            <i className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Image
                width={17}
                height={17}
                className="mr-2"
                src="/images/icon/calendar.svg"
                alt="Logo"
              />
            </i>
            <ReactDatePicker
              selected={value}
              // dateFormat="Pp"
              showIcon={false}
              placeholderText={placeholder || "Select date"}
              className="placeholder-lightgray2 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#F9FAFB]"
              onChange={(date) => {
                if (externalChangeHandler) {
                  externalChangeHandler(date);
                }
                onChange(date);
              }}
              onBlur={onBlur}
              {...rest}
            />
          </div>
        )}
        name={name}
        control={control}
        rules={rules}
      />

      {errors?.[name] && (
        <p className="text-error text-[12px] font-normal text-[#f00]">
          <span role="alert" id={`${name}Error`}>
            {errors[name]?.message}
          </span>
        </p>
      )}
    </>
  );
}
