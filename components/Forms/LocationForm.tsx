/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Link from "next/link";
import TextInput from "@/components/UI/TextInput";
import { IoIosArrowDown } from "react-icons/io";
import DropDown from "@/components/UI/DropDown";
import TextArea from "@/components/UI/TextArea";
import { useForm } from "react-hook-form";
import useLoader from "@/hooks/useLoader";
import { showError, showSuccess } from "@/utils/helper";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";
import {
  addLocation,
  getAllOwner,
  getLocationByID,
  updateLocation,
  uploadFile,
} from "@/redux/actions";

export default function LocationForm({
  type = "add",
  setBreadName,
  id = "",
}: any) {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ownersList, setOwnersList] = useState([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      mapLink: "",
      image: "",
      totalSlots: "",
      creditCardFee: "",
      amenities: "",
      salesTax: "",
      convenienceFee: "",
      dailySlot: {
        price: "",
        extendPrice: "",
      },
      monthlySlot: {
        price: "",
        extendPrice: "",
      },
      clientId: "",
    },
  });

  const getLocationById = async (id: string) => {
    try {
      showLoader();
      const res = await getLocationByID(id);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      return data;
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const getAllOwners = async () => {
    try {
      showLoader();
      const res = await getAllOwner({ page: 1, limit: 999999 });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setOwnersList(data?.SubAdmin);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getAllOwners();
  }, []);

  useEffect(() => {
    if (type != "edit") return;
    const loadInitialValues = async () => {
      try {
        const initialValues = await getLocationById(id);
        if (initialValues) {
          initialValues.daily_price = initialValues?.dailySlot?.price;
          initialValues.daily_extend_price =
            initialValues?.dailySlot?.extendPrice;
          initialValues.monthly_price = initialValues?.monthlySlot?.price;
          initialValues.monthly_extended_price =
            initialValues?.monthlySlot?.extendPrice;
          setBreadName(initialValues?.name);
          Object?.keys(initialValues)?.forEach((key: any) => {
            if (key == "image") {
              setValue("image", initialValues[key]);
              setImagePreview(initialValues[key]);
            } else {
              setValue(key, initialValues[key]);
            }
          });
        }
      } catch (err) {
        showError(err);
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
      const {
        daily_price,
        daily_extend_price,
        monthly_price,
        monthly_extended_price,
        name,
        address,
        mapLink,
        amenities,
        image,
        totalSlots,
        creditCardFee,
        salesTax,
        convenienceFee,
        clientId,
      } = formData || {};

      const postData = {
        name,
        address,
        mapLink,
        image: imageUrl ? imageUrl : imagePreview,
        totalSlots,
        creditCardFee,
        salesTax,
        convenienceFee,
        amenities,
        clientId,
        dailySlot: {
          price: daily_price,
          extendPrice: daily_extend_price,
        },
        monthlySlot: {
          price: monthly_price,
          extendPrice: monthly_extended_price,
        },
      };

      let resLocation;
      if (type == "edit" && id) {
        resLocation = await updateLocation(postData, id);
      } else {
        resLocation = await addLocation(postData);
      }

      const { status, message } = resLocation || {};
      if (!status) {
        showError(message, "Error!");
        return;
      }
      showSuccess(message);
      router.push("/locations");
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
              {type == "add" ? "Add Location" : "Edit Location"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="font-medium" href="/locations">
              <Button>Cancel</Button>
            </Link>
            <Button type="submit" className="bg-secondary text-white">
              {type == "add" ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      </header>
      <div>
        <div
          tabIndex={0}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            type == "add" && openFileDialog();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              type == "add" && openFileDialog();
            }
          }}
          className={classNames(
            {
              "cursor-pointer": type == "add",
              "cursor-default": type == "edit",
            },
            "border bg-white border-1 relative flex rounded-lg overflow-hidden justify-center border-stroke max-h-50 h-50 place-items-center"
          )}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Selected"
              className="max-w-full object-cover"
            />
          ) : (
            <p>Drag & Drop an Image Here or Click to Select</p>
          )}
          {type == "edit" && (
            <Button
              className="absolute bottom-2 right-2 bg-white w-fit"
              onClick={openFileDialog}
              type="button"
            >
              Edit background
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-title-sm font-semibold mt-4 text-black dark:text-white">
          Location details
        </p>
        <hr className="my-6 w-full text-bordercolor" />

        <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
          <TextInput
            placeholder="Location name"
            type="text"
            name="name"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Location Name *"
            rules={{
              required: "Please enter location",
            }}
          />
          <TextInput
            placeholder="Paste here direction map link"
            type="text"
            name="mapLink"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Direction map link *"
            rules={{
              required: "Please enter direction map link",
            }}
          />
          <TextArea
            placeholder="Address"
            type="text"
            name="address"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Address *"
            rows={5}
            rules={{
              required: "Please enter address",
            }}
          />
          <TextArea
            placeholder="Amenities"
            type="text"
            name="amenities"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md"
            label="Amenities"
            rows={5}
          />
        </div>
        <p className="text-title-sm font-semibold mt-4 text-black dark:text-white">
          Daily parking price
        </p>
        <hr className="my-6 w-full text-bordercolor" />
        <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
          <TextInput
            placeholder="0"
            leftIcon="$"
            type="number"
            name="daily_price"
            control={control}
            errors={errors}
            minVal="1"
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pl-6"
            label="Price per 12 hours *"
            rules={{
              required: "Please enter daily price",
            }}
          />
          <TextInput
            placeholder="0"
            leftIcon="$"
            type="number"
            name="daily_extend_price"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pl-6"
            label="Extension per hour price *"
            rules={{
              required: "Please enter daily extended price",
            }}
          />
        </div>
        <p className="text-title-sm font-semibold mt-4 text-black dark:text-white">
          Monthly parking price
        </p>
        <hr className="my-6 w-full text-bordercolor" />
        <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
          <TextInput
            placeholder="0"
            leftIcon="$"
            type="number"
            minVal="1"
            name="monthly_price"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pl-6"
            label="Price per 30 days *"
            rules={{
              required: "Please enter monthly price",
            }}
          />
          <TextInput
            placeholder="0"
            leftIcon="$"
            type="number"
            name="monthly_extended_price"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pl-6"
            label="Extension per hour price *"
            rules={{
              required: "Please enter monthly extended price",
            }}
          />
        </div>
        <p className="text-title-sm font-semibold mt-4 text-black dark:text-white">
          General Settings
        </p>
        <hr className="my-6 w-full text-bordercolor" />
        <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
          <TextInput
            placeholder="0"
            type="number"
            name="totalSlots"
            control={control}
            errors={errors}
            stepOff={true}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pr-6"
            label="Total Slots *"
            rules={{
              required: "Please enter total slots",
            }}
          />
          <TextInput
            placeholder="0"
            rightIcon="%"
            type="number"
            name="creditCardFee"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pr-6"
            label="Credit Card Fee *"
            rules={{
              required: "Required",
            }}
          />
          <TextInput
            placeholder="0"
            rightIcon="%"
            type="number"
            name="salesTax"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pr-6"
            label="Sales Tax *"
            rules={{
              required: "Required",
            }}
          />
          <TextInput
            placeholder="0"
            rightIcon="%"
            type="text"
            name="convenienceFee"
            control={control}
            errors={errors}
            labelClassName="text-sm font-medium text-gray-700"
            className="text-md pr-6"
            label="Convenience Fee *"
            rules={{
              required: "Required",
            }}
          />
        </div>
        <p className="text-title-sm font-semibold mt-4 text-black dark:text-white">
          Location Owner
        </p>
        <hr className="my-6 w-full text-bordercolor" />
        <div className="mb-4 mt-4 grid grid-col-1 gap-4">
          <DropDown
            name="clientId"
            label="Owner Name *"
            optionSelected={(item: any) => {
              setError("clientId", {
                type: "manual",
                message: "",
              });
              setValue("clientId", item?._id);
            }}
            defaultValue={getValues()?.clientId?.toString()}
            rightIcon={<IoIosArrowDown />}
            placeholder="Select owner name"
            control={control}
            errors={errors}
            rules={{
              required: "Please select owner name",
            }}
            options={ownersList}
          />
        </div>
        <div className="mb-5 mt-4">
          <div className="flex justify-end gap-2">
            <Link className="font-medium" href="/locations">
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
