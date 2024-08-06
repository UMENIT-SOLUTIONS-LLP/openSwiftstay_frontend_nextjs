/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, FormEvent } from "react";
import classNames from "classnames";
import Link from "next/link";
import TextInput from "@/components/UI/TextInput";
import { useForm } from "react-hook-form";
import useLoader from "@/hooks/useLoader";
import { showError, showSuccess } from "@/utils/helper";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import {
  addCompany,
  getCompanyByID,
  updateCompany,
  uploadFile,
} from "@/redux/actions";
import PhoneInputBox from "@/components/UI/PhoneInputBox";
import { parsePhoneNumber } from "react-phone-number-input";

export default function FleetManagementForm({ type = "add", id = "" }: any) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      image: "",
      name: "",
      person: "",
      email: "",
      phoneNo: "",
      ISOCode: "US",
    },
  });

  const backToHome = () => {
    router.push(`/fleetmanager/${id}`);
  };

  useEffect(() => {
    if (type != "edit") return;
    const loadInitialValues = async () => {
      try {
        showLoader();
        const res = await getCompanyByID(id);
        const { data, status } = res || {};
        if (!status) {
          backToHome();
          return;
        }
        const { name, phoneNo, ISOCode, email, person, dialCode, image } =
          data || {};
        const formattedNumber = `${dialCode}${phoneNo}`;
        setValue("name", name);
        setValue("image", image);
        setValue("email", email);
        setValue("person", person);
        setValue("phoneNo", formattedNumber);
        setValue("ISOCode", ISOCode);
        if (image) {
          setImagePreview(image);
        }
      } catch (error: any) {
        const { message } = error;
        showError(message, "Error!");
      } finally {
        hideLoader();
      }
    };
    loadInitialValues();
  }, [type, setValue, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const file = e?.target?.files?.[0];
      if (file) {
        setSelectedFile(file);
        handleImagePreview(file);
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e?.dataTransfer?.files) {
      const file = e?.dataTransfer?.files[0];
      setSelectedFile(file);
      handleImagePreview(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImagePreview = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        setImagePreview(event?.target?.result);
      };
    } else {
      setImagePreview(null);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const { name, person, email, phoneNo } = formData || {};

      const formattedNumber = parsePhoneNumber(phoneNo);
      const isValidPhone = formattedNumber?.isValid();
      if (!isValidPhone) {
        showError("Please enter a valid phone number");
        return;
      }
      const { countryCallingCode, nationalNumber: phoneNumber } =
        formattedNumber || {};
      const dialCode = `+${countryCallingCode}`;
      showLoader();
      let imageUrl = "";
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
        imageUrl = image;
      }
      hideLoader();
      const postData = {
        name,
        image: imageUrl ? imageUrl : imagePreview,
        person,
        email,
        phoneNo: phoneNumber,
        ISOCode: formData?.ISOCode,
        dialCode,
      };

      let resData;
      if (type == "edit" && id) {
        resData = await updateCompany(postData, id);
      } else {
        resData = await addCompany(postData);
      }
      const { status, message } = resData || {};
      if (!status) {
        showError(message, "Error!");
        return;
      }
      showSuccess(message);
      router.push(`/fleetmanager/${id}`);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <header className=" mb-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between">
          <div>
            <p className="text-title-lg font-bold text-black dark:text-white">
              {type == "add" ? "Add Company" : "Edit Company"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="font-medium" href={`/fleetmanager/${id}`}>
              <Button type="button">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-secondary text-white">
              {type == "add" ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      </header>
      <hr className="my-6 w-full text-bordercolor" />
      <div>
        <p className="text-black-2 text-sm font-semibold">Company logo</p>
        <p className="text-sm mb-4">
          {type == "add" ? "Add" : "Update"} your company logo
        </p>
        <div
          className={classNames({
            "": type == "add",
            "flex text-center gap-6": type == "edit",
          })}
        >
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={() => {
              type == "add" && openFileDialog();
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                type == "add" && openFileDialog();
              }
            }}
            style={{ boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.05)" }}
            className={classNames(
              {
                "cursor-pointer": type == "add",
                "cursor-default w-[150px] h-[150px]": type == "edit",
              },
              "border bg-white border-1 relative flex rounded-lg overflow-hidden justify-center border-stroke max-h-50 h-50 place-items-center"
            )}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected"
                className="max-w-full object-cover h-full w-full"
              />
            ) : (
              <p>Drag & Drop an Image Here or Click to Select</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {type == "edit" && (
            <Button
              className="bg-white w-fit"
              onClick={openFileDialog}
              topClassName="self-center"
              type="button"
            >
              Upload logo
            </Button>
          )}
        </div>
        <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
          <TextInput
            placeholder="Company name"
            type="text"
            name="name"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Company Name *"
            rules={{
              required: "Please enter Company name",
            }}
          />
          <TextInput
            placeholder="Contact person"
            type="text"
            name="person"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Contact person *"
            rules={{
              required: "Please enter contact person name",
            }}
          />
          <TextInput
            placeholder="Email address"
            type="text"
            name="email"
            control={control}
            errors={errors}
            label="Email address *"
            rules={{
              required: "Please enter your email address",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            }}
          />
          <PhoneInputBox
            label="Phone number *"
            control={control}
            name="phoneNo"
            errors={errors}
            setValue={setValue}
            rules={{
              required: "Please enter the phone number",
            }}
          />
        </div>
        <div className="mb-5 mt-4">
          <div className="flex justify-end gap-2">
            <Link className="font-medium" href={`/fleetmanager/${id}`}>
              <Button type="button">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-secondary text-white">
              {type == "add" ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
