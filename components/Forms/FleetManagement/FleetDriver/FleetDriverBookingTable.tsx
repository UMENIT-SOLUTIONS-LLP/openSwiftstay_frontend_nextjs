import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/UI/Button";
import Link from "next/link";
import DataTable from "@/components/UI/Tables/DataTable";
import { useRouter } from "next/router";
import useLoader from "@/hooks/useLoader";
import { showError, showSuccess } from "@/utils/helper";
import Image from "next/image";
import moment from "moment-timezone";
import { getBooking, getCompanyReports } from "@/redux/actions";
import { BOOKING_STATUS } from "@/constant";
import UserAvatar from "@/components/UI/UserAvatar";
import { useSelector } from "react-redux";

const FleetDriverBookingTable = ({
  companyid = "",
  driverid = "",
  userid = "",
  type = "active",
  val = BOOKING_STATUS?.UPCOMING,
  children,
}: any) => {
  const [value, setValue] = useState(children);
  const router = useRouter();
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
      const res = await getBooking({
        page,
        bookingStatus,
        limit,
        search,
        companyId: companyid,
        userId: userid,
      });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        // showError(message, "Error!");
        return;
      }
      setBookings(data?.bookings);
      setTotalRecords(data?.totalBookings);
    } catch (err: any) {
      const { message } = err;
      // showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (val && companyid && userid) {
      getBookingData({ bookingStatus: val });
    }
  }, [val, companyid, userid]);

  const onPageChange = (e: any) => {
    setFilterSearch((prev) => ({ ...prev, page: e }));
    getBookingData({
      search: filterSearch?.search,
      page: e,
      bookingStatus: val,
    });
  };

  useEffect(() => {
    setValue(children);
  }, [children]);

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
      title: "Slot Date/Time",
      key: "active_bookings",
      render: (item: any) => {
        return (
          <>
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
          </>
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
        {/* <Button icon="/images/icon/filter-lines.svg">Filters</Button> */}
      </div>
      <DataTable
        columns={columns}
        data={bookings}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onSearch={null}
        moveBack={moveBack}
      />
    </div>
  );
};

export default FleetDriverBookingTable;
