/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TextInput from "@/components/UI/TextInput";
import { useForm } from "react-hook-form";
import useLoader from "@/hooks/useLoader";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/utils/helper";
import PhoneInputBox from "@/components/UI/PhoneInputBox";
import { parsePhoneNumber } from "react-phone-number-input";
import { getDriverByID, updateDriver, uploadFile } from "@/redux/actions";
import UserAvatar from "@/components/UI/UserAvatar";

export default function Profile({
  type = "edit",
  id,
  setDriverName,
  returnTarget = "/drivers",
}: any) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [driverData, setDriverData] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      phoneNo: "",
      name: "",
      image: "",
      ISOCode: "US",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const file = e?.target?.files[0];
      setSelectedFile(file);
      handleImagePreview(file);
    }
  };

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const backToHome = () => {
    router.push(returnTarget);
  };

  const fetchUserProfile = async (id: any) => {
    try {
      showLoader();
      const res = await getDriverByID(id);
      const { data, status } = res || {};
      if (!status) {
        backToHome();
        return;
      }
      const { name, phoneNo, ISOCode, dialCode, image } = data || {};
      const formattedNumber = `${dialCode}${phoneNo}`;
      setDriverName(name);
      setValue("name", name);
      setValue("image", image);
      setValue("phoneNo", formattedNumber);
      setValue("ISOCode", ISOCode);
      if (image) {
        setImagePreview(image);
      }
      setDriverData(name);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchUserProfile(id);
  }, [id]);

  const handleImagePreview = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e?.target?.result === "string") {
          setImagePreview(e?.target?.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

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

      const postData = {
        name: formData?.name,
        phoneNo: phoneNumber,
        dialCode,
        ISOCode: formData?.ISOCode,
        image: "",
      };
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);

        const resImage = await uploadFile(fileData);
        const { data, status } = resImage || {};
        if (!status) {
          showError("Error while uploading image");
          return;
        }
        const { image } = data || {};
        postData.image = image;
      }

      const resProfile = await updateDriver(postData, id);
      const { data, status, message } = resProfile || {};
      if (!status) {
        showError(message);
        return;
      }
      const { _id, name } = data;
      setDriverName(name);
      fetchUserProfile(_id);
      showSuccess(message);
      router.push(returnTarget);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex justify-center">
      <form
        className="w-1/2 flex flex-col items-center"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="h-[80px] w-[80px]">
          <UserAvatar
            className="overflow-hidden relative justify-center bg-cover border-white w-20 h-20 place-items-center border-4 shadow-md"
            image={imagePreview}
            name={driverData || ""}
          />
        </div>
        <Button
          onClick={handleAddPhoto}
          type="button"
          className="relative bottom-2 bg-white justify-center"
        >
          {selectedFile ? "Change Photo" : "Add Photo"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mb-4 mt-4 w-full grid grid-col-1 md:grid-cols-1 gap-4">
          <TextInput
            placeholder="Full name *"
            type="text"
            name="name"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-blue-gray-600"
            className="text-md"
            label="Full Name"
            rules={{
              required: "Please enter name",
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
        </div>
        <hr className="my-6 w-full text-bordercolor" />
        <div className="mb-5 w-full mt-4">
          <div className="flex justify-between gap-2">
            <Link className="w-1/2 font-medium" href={returnTarget}>
              <Button type="button" className="bg-white w-full justify-center">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              topClassName="w-1/2"
              className="bg-secondary w-full text-white justify-center"
            >
              {type == "add" ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
