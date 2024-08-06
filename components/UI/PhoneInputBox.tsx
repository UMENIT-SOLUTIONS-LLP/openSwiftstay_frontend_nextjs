/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames";
import React, { useEffect } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input/input";
import PhoneInput from "react-phone-number-input/react-hook-form-input";

export default function PhoneInputBox({
  label,
  errors,
  control,
  rules,
  name,
  setValue,
  ...rest
}: any) {
  const ALLOWED_COUNTRIES = ["US", "IN", "CA", "MX"];
  const [selectedCountry, setSelectedCountry] = React.useState<any>("US");
  const [isCountryCodeSelected, setIsCountryCodeSelected] =
    React.useState<any>(false);

  const defaultValue = control._getWatch(name);
  const ISOCode = control._getWatch("ISOCode");
  useEffect(() => {
    if (defaultValue && ISOCode && !isCountryCodeSelected) {
      const formattedNumber = parsePhoneNumber(defaultValue);
      const { countryCallingCode } = formattedNumber || {};
      // const countryCode: any = ALLOWED_COUNTRIES.find(
      //   (country: any) => getCountryCallingCode(country) === countryCallingCode
      // );
      const countryCode: any = ALLOWED_COUNTRIES.find(
        (country: any) => country === ISOCode
      );
      setSelectedCountry(countryCode);
      setIsCountryCodeSelected(true);
    }
  }, [defaultValue, ISOCode]);

  return (
    <div>
      {label && (
        <label className="text-medium mb-1.5 block text-sm">{label}</label>
      )}

      <div
        className={classNames(
          "w-full appearance-none rounded-lg border border-stroke text-black-2 bg-white py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none flex px-3",
          {
            "border-red-500": !!errors?.name,
          }
        )}
      >
        <select
          className="border-0 py-0 pl-0 focus:outline-none focus:ring-0"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setValue("ISOCode", e.target.value);
          }}
        >
          {ALLOWED_COUNTRIES.map((country: any, index: any) => {
            const countryCode = getCountryCallingCode(country);
            return (
              <option
                key={index}
                value={country}
              >{`${country} +${countryCode}`}</option>
            );
          })}
        </select>
        <PhoneInput
          name={name}
          country={selectedCountry}
          rules={rules}
          control={control}
          className="placeholder-lightgray2 w-full border-0 focus:outline-none focus:ring-0"
          placeholder="Enter phone number"
          maxLength={15}
          international={true}
        />
      </div>

      {errors?.[name] && (
        <p className="mt-1 text-xs text-red-500">{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
