/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import DropDown from "@/components/UI/DropDown";
import { useForm } from "react-hook-form";
import useLoader from "@/hooks/useLoader";
import { removeProperties, showError, showSuccess } from "@/utils/helper";
import Button from "@/components/UI/Button";
import { useRouter } from "next/router";
import {
  createCompanyBooking,
  editCompanyBooking,
  getAllDriver,
  getBookingByID,
  getLocation,
} from "@/redux/actions";
import DatePickerInput from "@/components/UI/DatePicker";
import dayjs from "dayjs";
import { BOOKING_TYPE } from "@/constant";

interface FormData {
  locationId: string;
  driverId: string;
  startDate: string | Date; // Modify the type here
  endDate: string | Date; // Modify the type here
}

export default function FleetManagementBookingForm({
  type = "add",
  setBreadName,
  companyid = "",
  id = "",
}: any) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      locationId: "",
      driverId: "",
      startDate: "",
      endDate: "",
    },
  });

  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [allLocations, setAllLocations] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [startMinTime, setstartMinTime] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [minTime, setMinTime] = useState<any>(new Date());

  const backToHome = () => {
    // router.push("/fleetmanager");
  };

  useEffect(() => {
    if (type != "edit") return;
    if (type && id && companyid) {
      const loadInitialValues = async () => {
        try {
          const res = await getBookingByID(id);
          const { data, status } = res || {};
          if (!status) {
            backToHome();
            return;
          }
          const { locationId, userId, checkInTime, checkOutTime } = data || {};
          const driverId = userId?._id;
          const startDate = new Date(checkInTime);
          const endDate = new Date(checkOutTime);
          setValue("locationId", locationId?._id);
          setValue("driverId", driverId);
          setValue("startDate", startDate);
          setValue("endDate", endDate);
          setMinTime(new Date(new Date().setHours(0, 0, 0, 0)));
        } catch (error: any) {
          const { message } = error;
          showError(message, "Error!");
        } finally {
          hideLoader();
        }
      };
      loadInitialValues();
    }
  }, [type, setValue, id, companyid]);

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const { startDate, endDate, locationId, driverId } = formData;
      const checkInDate = dayjs(startDate).toISOString()?.replace("T", " ");
      const checkOutDate = dayjs(endDate).toISOString()?.replace("T", " ");

      if (startDate < new Date()) {
        showError("Start time should not be less than current time", "Error!");
        return;
      }
      if (checkInDate == checkOutDate) {
        showError("Start date should not be same as end date", "Error!");
        return;
      }
      if (checkInDate > checkOutDate) {
        showError("Start date should be less than end date", "Error!");
        return;
      }

      const bookingData = {
        checkInTime: checkInDate,
        checkOutTime: checkOutDate,
        locationId,
        driverId,
        bookingType: BOOKING_TYPE.CUSTOM,
        companyId: companyid,
      };

      var resLocation;
      if (type == "edit" && id) {
        resLocation = await editCompanyBooking({
          ...bookingData,
          bookingId: id,
        });
      } else {
        resLocation = await createCompanyBooking(bookingData);
      }

      const { status, message } = resLocation || {};
      if (!status) {
        showError(message, "Error!");
        return;
      }
      showSuccess(message);
      router.push({
        pathname: `/fleetmanager/${companyid}`,
        query: { tab: 2 },
      });
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const getAllLocations = async () => {
    try {
      showLoader();
      const res = await getLocation({ page: 1, limit: 999999 });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setAllLocations(data?.location);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const getAllDrivers = async () => {
    try {
      showLoader();
      const res = await getAllDriver({
        page: 1,
        limit: 999999,
        companyId: companyid,
      });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setAllDrivers(data);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const startDateChange = (e: any) => {
    const newStartDate = new Date(e);
    setMinTime(newStartDate);
    if (
      newStartDate.getFullYear() > new Date().getFullYear() ||
      (newStartDate.getFullYear() === new Date().getFullYear() &&
        newStartDate.getMonth() > new Date().getMonth()) ||
      (newStartDate.getFullYear() === new Date().getFullYear() &&
        newStartDate.getMonth() === new Date().getMonth() &&
        newStartDate.getDate() > new Date().getDate())
    ) {
      setstartMinTime(new Date(new Date().setHours(0, 0, 0, 0)));
    } else if (newStartDate.getDate() == new Date().getDate()) {
      setstartMinTime(new Date());
    }
  };

  const endDateChange = (e: any) => {
    const newEndDate = new Date(e);
    if (
      newEndDate.getDate() == new Date(watch("startDate")).getDate() &&
      newEndDate.getTime() < new Date(watch("startDate")).getTime()
    ) {
      setValue("endDate", new Date(watch("startDate")));
    }
    if (newEndDate.getDate() == new Date(watch("startDate")).getDate()) {
      setMinTime(new Date(watch("startDate")));
    } else if (newEndDate > new Date(watch("startDate"))) {
      setMinTime(new Date(new Date().setHours(0, 0, 0, 0)));
    }
  };

  useEffect(() => {
    getAllLocations();
    getAllDrivers();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <header className=" mb-4 top-0 z-20 flex w-full dark:drop-shadow-none">
          <div className="flex flex-grow items-center justify-between">
            <div>
              <p className="text-title-lg font-bold text-black dark:text-white">
                {type == "add" ? "Create Booking" : "Edit Booking"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                className="font-medium"
                href={{
                  pathname: `/fleetmanager/${companyid}`,
                  query: { tab: 2 },
                }}
              >
                <Button>Cancel</Button>
              </Link>
              <Button type="submit" className="bg-secondary text-white">
                {type == "add" ? "Add" : "Save"}
              </Button>
            </div>
          </div>
        </header>
        <hr className="my-6 w-full text-bordercolor" />
        <div>
          <div className="mb-4 mt-4 grid grid-col-1 md:grid-cols-2 gap-4">
            <DropDown
              name="locationId"
              label="Select location"
              openBottom={true}
              optionSelected={(item: any) => {
                setError("locationId", {
                  type: "manual",
                  message: "",
                });
                setValue("locationId", item?._id);
              }}
              defaultValue={getValues()?.locationId?.toString()}
              rightIcon={<IoIosArrowDown />}
              placeholder="Select location"
              control={control}
              disabled={type == "add" ? false : true}
              errors={errors}
              rules={{
                required: "Please select location",
              }}
              options={allLocations}
            />
            <DropDown
              name="driverId"
              label="Driver"
              openBottom={true}
              disabled={type == "edit" ? true : false}
              optionSelected={(item: any) => {
                setError("driverId", {
                  type: "manual",
                  message: "",
                });
                setValue("driverId", item?._id);
              }}
              defaultValue={getValues()?.driverId?.toString()}
              rightIcon={<IoIosArrowDown />}
              placeholder="Select driver"
              control={control}
              errors={errors}
              rules={{
                required: "Please select driver",
              }}
              options={allDrivers}
            />
            <div className="col-span-1">
              <DatePickerInput
                label="Start Date"
                timeIntervals={15}
                showTimeSelect
                name="startDate"
                dateFormat="Pp"
                control={control}
                placeholder="Select date and time"
                errors={errors}
                minDate={new Date()}
                maxDate={watch("endDate")}
                minTime={startMinTime || new Date()}
                maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                externalChangeHandler={(date: any) => {
                  startDateChange(date);
                }}
                rules={{
                  required: "Please select start date",
                }}
              />
            </div>
            <div className="col-span-1">
              <DatePickerInput
                label="End Date"
                timeIntervals={15}
                dateFormat="Pp"
                showTimeSelect
                placeholder="Select date and time"
                name="endDate"
                minDate={watch("startDate") || new Date()}
                minTime={minTime || watch("startDate")}
                maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                control={control}
                externalChangeHandler={(date: any) => {
                  endDateChange(date);
                }}
                errors={errors}
                rules={{
                  required: "Please select end date",
                }}
              />
            </div>
          </div>
          <div className="mb-5 mt-4">
            <div className="flex justify-end gap-2">
              <Link
                className="font-medium"
                href={{
                  pathname: `/fleetmanager/${companyid}`,
                  query: { tab: 2 },
                }}
              >
                <Button type="button">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-secondary text-white">
                {type == "add" ? "Add" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
