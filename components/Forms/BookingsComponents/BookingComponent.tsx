import React, { useEffect, useRef, useState } from "react";
import DataTable from "@/components/UI/Tables/DataTable";
import { useRouter } from "next/router";
import useLoader from "@/hooks/useLoader";
import Image from "next/image";
import moment from "moment-timezone";
import { getBooking, getReports } from "@/redux/actions";
import UserAvatar from "../../UI/UserAvatar";
import { BOOKING_STATUS, BOOKING_TYPE, LOCATION_TYPE } from "@/constant";
import GenerateReports from "@/components/Forms/BookingsComponents/GenerateReport";

const BookingComponent = ({
  type = "active",
  val = BOOKING_STATUS?.UPCOMING,
}: any) => {
  const { showLoader, hideLoader } = useLoader();
  const [bookings, setBookings] = useState([]);
  const [totalRecords, setTotalRecords] = useState("10");
  const [filterSearch, setFilterSearch] = useState({ search: "", page: 1 });
  const [moveBack, setMoveBack] = useState(0);
  const debounceTimer = useRef<any>(null);
  const [searchValue, setSearchValue] = useState("");

  const getBookingData = async ({
    page = 1,
    bookingStatus = val,
    limit = 10,
    search = "",
  } = {}) => {
    try {
      showLoader();
      const res = await getBooking({ page, bookingStatus, limit, search });
      const { status, data } = res || {};
      if (!status) {
        return;
      }
      setBookings(data?.bookings);
      setTotalRecords(data?.totalBookings);
    } catch (err: any) {
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getBookingData({ bookingStatus: val });
  }, [val]);

  const onPageChange = (e: any) => {
    setFilterSearch((prev) => ({ ...prev, page: e }));
    getBookingData({
      search: filterSearch?.search,
      page: e,
      bookingStatus: val,
    });
  };

  useEffect(() => {
    setSearchValue("");
  }, [type]);

  const onSearch = (query: string) => {
    setSearchValue(query);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
      setMoveBack(0);
    }
    debounceTimer.current = setTimeout(() => {
      setFilterSearch((prev) => ({ ...prev, search: query }));
      getBookingData({ page: 1, search: query });
      setMoveBack(1);
    }, 300);
  };

  const titleStatus = (
    <div className="flex items-center">
      Status
      {/* <Image
        width={17}
        height={17}
        className="ml-4"
        src="/images/icon/down.svg"
        alt="Logo"
      /> */}
    </div>
  );

  const columns = [
    {
      title: "Booking ID",
      key: "bookingId",
    },
    {
      title: "Name",
      key: "name",
      render: (item: any) => {
        return (
          <div className="flex place-items-center">
            <div className="h-[40px] w-[40px]">
              <UserAvatar
                image={item?.userId?.image}
                name={item?.userId?.name || ""}
                size={40}
                fontSize={16}
              />
            </div>
            <div className="ml-2">
              <p className="text-sm font-bold text-black">
                {item?.userId?.name}
              </p>
              <p className="text-sm">
                {item?.userId?.dialCode} {item?.userId?.phoneNo}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Location",
      key: "location_name",
      render: (item: any) => {
        return (
          <div className="flex text-sm place-items-center">
            <div>
              <p className="font-bold text-black dark:text-white">
                {item?.locationId?.name}
              </p>
              <span className="flex">
                <Image
                  width={12}
                  height={12}
                  className="mr-2"
                  src="/images/icon/location_booking.svg"
                  alt="location icon"
                />
                <p>{item?.locationId?.address}</p>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Booking Type",
      key: "status",
      render: (item: any) => {
        if (item?.locationType == LOCATION_TYPE?.DAILY) {
          return "Daily";
        } else if (item?.locationType == LOCATION_TYPE?.MONTHLY) {
          return "Monthy";
        } else if (item?.bookingType == BOOKING_TYPE?.CUSTOM) {
          return "Custom";
        }
      },
    },
    {
      title: "Slot Date/Time",
      key: "active_bookings",
      render: (item: any) => {
        return (
          <div className="flex text-sm  place-items-center">
            <div>
              <p>
                <span className="font-bold">Check in:</span>
                {moment(item?.checkInTime).format("DD MMM YYYY hh:mm A")}
              </p>
              <p>
                <span className="font-bold">Check out:</span>
                {moment(item?.checkOutTime).format("DD MMM YYYY hh:mm A")}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Total Amount",
      key: "total",
      render: (item: any) => {
        return <>${item?.total?.toFixed(2)}</>;
      },
    },
    {
      title: titleStatus,
      key: "status",
      render: (item: any) => {
        if (item?.bookingStatus == BOOKING_STATUS?.ACTIVE) {
          return (
            <p className="text-[#079455] w-fit text-sm border-2 relative border-[#067647] px-4 py-1 rounded-full">
              Active
            </p>
          );
        } else if (item?.bookingStatus == BOOKING_STATUS?.UPCOMING) {
          return (
            <p className="text-[#1570EF]  w-fit text-sm border-2 relative border-[#1570EF] px-4 py-1 rounded-full">
              Upcoming
            </p>
          );
        } else {
          return (
            <p className="text-[#079455]  w-fit  text-sm border-2 relative border-[#067647] px-4 py-1 rounded-full">
              Completed
            </p>
          );
        }
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mt-3 mb-5">
        <div className="relative w-2/3 sm:w-1/3 md:w-2/5 lg:w-1/4">
          <Image
            src="/images/icon/search.svg"
            width={17}
            height={17}
            alt="Search Icon"
            className="absolute left-3 top-3 w-4 h-4 text-black"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 h-10 border border-stroke rounded-lg px-4 text-sm text-black"
            onChange={(e) => {
              if (onSearch) {
                onSearch(e?.target?.value);
              }
            }}
            value={searchValue}
          />
        </div>
        <GenerateReports getApi={getReports} />
        {/* <Button icon="/images/icon/filter-lines.svg">Filters</Button> */}
      </div>
      <DataTable
        columns={columns}
        data={bookings}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onSearch={null}
        title={"booking"}
        moveBack={moveBack}
      />
    </div>
  );
};

export default BookingComponent;
