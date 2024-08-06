import React, { useState, useEffect } from "react";
import CardDataStats from "@/components/CardDataStats";
import { getDashboardData, getLocation, getProfile } from "@/redux/actions";
import useLoader from "@/hooks/useLoader";
import { logoutUser, showError } from "@/utils/helper";
import { useDispatch } from "react-redux";
import moment from "moment-timezone";
import { LineChart } from "@/components/LineChart";
import Image from "next/image";
import DropDown from "@/components/UI/DropDown";
import { useForm } from "react-hook-form";
import DatePickerInput from "@/components/UI/DatePicker";
import Button from "@/components/UI/Button";
import classNames from "classnames";
import MultiSelectDropdown from "@/components/UI/MultiSelectDropdown";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [stats, setStats] = React.useState<any>(null);
  const { showLoader, hideLoader } = useLoader();
  const [locations, setLocations] = useState([]);
  const [locationsids, setLocationsids] = useState<any>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("12Months");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [dashboardData, setDashboardData] = useState({
    totalLocations: "",
    totalParkingSlots: "",
    totalFilledSlots: "",
    totalEmptySlots: "",
    revenueThisMonth: "",
    avgMonthlyRevenue: "",
    revenueData: { orderData: [] },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      check_in_date: "",
      check_out_date: "",
      locationId: [],
    },
  });

  const getLocationData = async ({
    page = 1,
    limit = 10,
    search = "",
  } = {}) => {
    try {
      showLoader();
      const res = await getLocation({ page, limit, search });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setLocations(data?.location);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const handleFormSubmit = async (formData: any) => {
    // if (!userToken) {
    //   const event = new CustomEvent("openLoginModal");
    //   window.dispatchEvent(event);
    //   return;
    // }
    // const { check_in_date, check_out_date } = formData;
    // const checkInDate = dayjs(check_in_date).format("YYYY-MM-DD HH:mm:ss");
    // const checkOutDate = dayjs(check_out_date).format("YYYY-MM-DD HH:mm:ss");
    // const bookingData = {
    //   check_in_date: checkInDate,
    //   check_out_date: checkOutDate,
    //   parking_duration: parkingDuration,
    //   slot_type: slotType,
    // };
    // dispatch({ type: "SET_BOOKING_DATA", payload: bookingData });
    // router.push("/checkout/payment");
  };

  // watch check_in_date value changes
  const checkInDate = watch("check_in_date");
  const locationId = watch("locationId");

  useEffect(() => {
    if (locationId) {
      setLocationsids(locationId);
    }
  }, [locationId]);

  useEffect(() => {
    if (!locationsids) return;
    fetchData();
  }, [locationsids]);

  useEffect(() => {
    if (checkInDate) {
      // let checkOutDate: any = dayjs(checkInDate);
      // if (parkingDuration === "monthly") {
      //   checkOutDate = dayjs(checkInDate).add(1, "month").toDate();
      // } else {
      //   checkOutDate = dayjs(checkInDate).add(12, "hours").toDate();
      // }
      // setValue("check_out_date", checkOutDate);
    }
  }, [checkInDate]);

  const checkAdminUser = async () => {
    try {
      const res = await getProfile();
      const { status, data } = res || {};
      if (!status) {
        logoutUser();
        return;
      }
      dispatch({ type: "SET_USER_PROFILE", payload: { profile: data } });
    } catch (err: any) {
      logoutUser();
    }
  };

  const fetchData = async ({
    duration = selectedDuration,
    locationsIds = locationsids,
  }: any = {}) => {
    try {
      showLoader();
      let startDate, endDate;

      if (duration === "24Hours") {
        const todayStart = moment.utc().startOf("day");
        const todayEnd = moment.utc().endOf("day");

        startDate = todayStart.format("YYYY-MM-DDTHH.mm.ss");
        endDate = todayEnd.format("YYYY-MM-DDTHH.mm.ss");
        // const localDate = new Date();
        // localDate.setHours(0, 0, 0, 0);
        // startDate = localDate.toISOString();
        // localDate.setHours(23, 59, 59, 999);
        // endDate = localDate.toISOString();
      }

      const res = await getDashboardData({
        type: duration,
        locationId: locationsIds,
        ...(duration == "24Hours" && {
          startDate,
          endDate,
        }),
      });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setDashboardData(data);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    checkAdminUser();
    fetchData({});
    getLocationData();
  }, []);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const today = new Date().toLocaleDateString("en-US", options);
    setCurrentDate(today);
  }, []);

  const durations = [
    { name: "12 months", value: "12Months" },
    { name: "3 months", value: "3Months" },
    { name: "30 days", value: "30Days" },
    { name: "7 days", value: "7Days" },
    { name: "24 Hours", value: "24Hours" },
  ];

  const handleDurationChange = (duration: string) => {
    fetchData({ duration });
    setSelectedDuration(duration);
  };

  return (
    <>
      <header className=" mb-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-wrap flex-grow items-center justify-between">
          <div>
            <p className="text-title-lg font-bold text-black dark:text-white">
              Dashboard
            </p>
            <span>{currentDate}</span>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* <div className="grid grid-cols-9 gap-4">
              <div className="col-span-4 relative">
                <DatePickerInput
                  label=""
                  showTimeSelect
                  timeIntervals={15}
                  placeholder="Start Date"
                  name="check_in_date"
                  control={control}
                  errors={errors}
                  // disabled={slotType === 'now'}
                />
              </div>
              <div className="col-span-1 self-center text-center">To</div>
              <div className="col-span-4 relative">
                <DatePickerInput
                  label=""
                  showTimeSelect
                  placeholder="End Date"
                  timeIntervals={15}
                  name="check_out_date"
                  control={control}
                  errors={errors}
                  // disabled={slotType === 'now'}
                />
              </div>
            </div> */}
            {/* <Button className="w-max" icon="/images/icon/calendar.svg">Today</Button> */}
            <MultiSelectDropdown
              name="locationId"
              label=""
              optionSelected={(item: any) => {
                setValue("locationId", item);
              }}
              className="w-auto"
              defaultValue={""}
              openBottom={true}
              leftIcon={
                <Image
                  width={17}
                  height={17}
                  style={{ minWidth: "17px" }}
                  src="/images/icon/filter-lines.svg"
                  alt="Logo"
                />
              }
              placeholder="All Locations"
              control={control}
              errors={errors}
              options={locations}
            />
          </div>
          {/* <Button icon="/images/icon/filter-lines.svg">All Locations</Button> */}
        </div>
      </header>
      <hr className="my-6 w-full text-bordercolor" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Parking Locations"
          total={dashboardData?.totalLocations}
          type=""
          value={"10%"}
        />
        <CardDataStats
          title="Total Parking Spots"
          total={dashboardData?.totalParkingSlots}
          type=""
          value={"12%"}
        />
        <CardDataStats
          title="Total Parking Spots Filled"
          total={dashboardData?.totalFilledSlots}
          type=""
          value={"2%"}
        />
        <CardDataStats
          title="Total Empty Spots"
          total={dashboardData?.totalEmptySlots}
          type=""
          value={"2%"}
        />
      </div>

      <div className="grid grid-cols-1 gap mt-4 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="md:col-span-1 xl:col-span-2">
          <CardDataStats
            title="Revenue this month"
            total={`$${Number(dashboardData?.revenueThisMonth)?.toFixed(2)}`}
            type=""
            value={"10%"}
          />
        </div>
        <div className="md:col-span-1 xl:col-span-2">
          <CardDataStats
            title="AVG. monthly revenue"
            total={`$${Number(dashboardData?.avgMonthlyRevenue)?.toFixed(2)}`}
            type=""
            value={"12%"}
          />
        </div>
      </div>

      <div className="rounded-xl mt-4 border border-stroke bg-white py-4 px-5 shadow-card flex flex-col items-center gap-5">
        <div className="w-full flex justify-between">
          <span className="font-bold">Revenue</span>
          {/* <Button>View report</Button> */}
        </div>
        <div className="container mx-auto">
          <div className="space-x-2">
            {durations?.map((duration, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleDurationChange(duration?.value)}
                  className={classNames(
                    "px-4 py-2 rounded-lg focus:outline-none",
                    {
                      "text-black": selectedDuration === duration?.value,
                    }
                  )}
                >
                  {duration?.name}
                </button>
              );
            })}
          </div>
        </div>
        <LineChart
          duration={selectedDuration}
          data={dashboardData?.revenueData}
        />
      </div>
    </>
  );
}
