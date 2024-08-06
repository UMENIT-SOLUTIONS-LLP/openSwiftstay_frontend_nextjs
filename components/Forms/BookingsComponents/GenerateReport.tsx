import React, { useState, useEffect } from "react";
import { TabSwitch, Tab } from "@/components/UI/Tab/tab";
import BookingComponent from "@/components/Forms/BookingsComponents/BookingComponent";
import Modal from "@/components/UI/Modals/Modal";
import dayjs from "dayjs";
import useLoader from "@/hooks/useLoader";
import Button from "@/components/UI/Button";
import { BOOKING_STATUS } from "@/constant";
import { useForm } from "react-hook-form";
import DatePickerInput from "@/components/UI/DatePicker";
import { getCompanyReports, getReports } from "@/redux/actions";
import { useSelector } from "react-redux";

const GenerateReports = ({
  getApi,
  props = {},
}: {
  getApi: any;
  props?: any;
}) => {
  const { showLoader, hideLoader } = useLoader();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const { startDate, endDate } = formData;
      const checkInDate = dayjs(startDate).toISOString()?.replace("T", " ");
      let checkOutDate = dayjs(endDate)
        .add(1, "day")
        .toISOString()
        .replace("T", " ");

      const bookingData = {
        startDate: checkInDate,
        endDate: checkOutDate,
      };
      const res = await getApi({ ...bookingData }, { ...props });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        // showError(message, "Error!");
        return;
      }
      window.location.href = data?.redirection;
    } catch (err: any) {
      const { message } = err;
      // showError(message, "Error!");
    } finally {
      hideLoader();
      setModalIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setModalIsOpen(true)}
        className="bg-secondary text-white"
        icon="/images/icon/exportdrivers.svg"
      >
        Generate Report
      </Button>

      <Modal
        className="overflow-visible"
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
          reset();
        }}
      >
        <div>
          <div className="text-center">
            <p className="font-bold text-md text-black">Bookings Report</p>
          </div>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="col-span-1">
                <DatePickerInput
                  label="Start Date"
                  timeIntervals={15}
                  name="startDate"
                  control={control}
                  errors={errors}
                  maxDate={new Date()}
                  rules={{
                    required: "Please select start date",
                  }}
                />
              </div>
              <div className="col-span-1">
                <DatePickerInput
                  label="End Date"
                  timeIntervals={15}
                  name="endDate"
                  minDate={watch("startDate")}
                  control={control}
                  maxDate={new Date()}
                  errors={errors}
                  rules={{
                    required: "Please select end date",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-8">
              <Button
                onClick={() => {
                  setModalIsOpen(false);
                  reset();
                }}
                className="w-full justify-center"
                topClassName="w-1/2"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                topClassName="w-1/2"
                className="w-full bg-primary text-white justify-center"
              >
                Download
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default GenerateReports;
