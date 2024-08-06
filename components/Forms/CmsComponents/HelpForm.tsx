import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import TextInput from "@/components/UI/TextInput";
import TextArea from "@/components/UI/TextArea";
import { useForm } from "react-hook-form";
import useLoader from "@/hooks/useLoader";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/utils/helper";
import { parsePhoneNumber } from "react-phone-number-input";
import {
  addCMS,
  getCMS,
  getOwnerByID,
  updateDriver,
  updateOwner,
  uploadFile,
} from "@/redux/actions";
import Image from "next/image";
import UserAvatar from "@/components/UI/UserAvatar";
import PhoneInputBox from "@/components/UI/PhoneInputBox";

export default function HelpForm({
  type = "contactUs",
  label = "Contact us",
}: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [contactUsData, setContactUsData] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      phoneNo: "",
      dialCode: "",
      address: "",
      email: "",
      ISOCode: "US",
    },
  });

  const backToHome = () => {
    router.push("/drivers");
  };

  const fetchCmsHelpData = async () => {
    try {
      showLoader();
      const res = await getCMS();
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      const { phoneNo, email, ISOCode, dialCode, address } = data?.[type] || {};
      const formattedNumber = `${dialCode}${phoneNo}`;
      setValue("address", address);
      setValue("email", email);
      setValue("phoneNo", formattedNumber);
      setValue("ISOCode", ISOCode);
      setContactUsData(data?.[type]);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchCmsHelpData();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const { phoneNo } = formData;
      const formattedNumber = parsePhoneNumber(phoneNo);
      const isValidPhone = formattedNumber?.isValid();
      if (!isValidPhone) {
        showError("Please enter a valid phone number");
        return;
      }
      const { countryCallingCode, nationalNumber: phoneNumber } =
        formattedNumber || {};
      const dialCode = `+${countryCallingCode}`;

      let postData = {
        contactUs: {
          name: formData?.name,
          phoneNo: phoneNumber,
          ISOCode: formData?.ISOCode,
          dialCode,
          address: formData?.address,
          email: formData?.email,
        },
      };
      const res = await addCMS(postData);
      const { data, status, message } = res || {};
      if (!status) {
        showError(message);
        return;
      }
      fetchCmsHelpData();
      showSuccess(message);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between my-8">
        <p className="text-title-md font-semibold text-black dark:text-white">
          {label}
        </p>
        <form
          className="w-5/6 flex flex-col self-center items-center md:w-2/5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="mb-4 mt-4 w-full grid grid-col-1 md:grid-cols-1 gap-4">
            <TextInput
              placeholder="Enter your email *"
              type="text"
              name="email"
              control={control}
              errors={errors}
              label="Email address"
              rules={{
                required: "Please enter your email address",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              }}
            />
            <PhoneInputBox
              label="Phone *"
              control={control}
              name="phoneNo"
              errors={errors}
              setValue={setValue}
              rules={{
                required: "Please enter the phone number",
              }}
            />
            <TextArea
              placeholder="Enter address *"
              type="text"
              name="address"
              control={control}
              errors={errors}
              rows={4}
              className="text-md"
              label="Address"
              rules={{
                required: "Please enter address",
              }}
            />
          </div>
          <hr className="my-6 w-full text-bordercolor" />
          <div className="mb-5 w-full mt-4">
            <div className="flex justify-center gap-2">
              <Button
                type="submit"
                topClassName="w-1/2"
                className="bg-secondary w-full text-white justify-center"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
