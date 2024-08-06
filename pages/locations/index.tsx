import React, { useState, useRef, useEffect } from "react";
import useLoader from "@/hooks/useLoader";
import Link from "next/link";
import DataTable from "@/components/UI/Tables/DataTable";
import { useRouter } from "next/router";
import Modal from "@/components/UI/Modals/Modal";
import { showError, showSuccess } from "@/utils/helper";
import { ADMIN_ROLE } from "@/constant";
import { useSelector } from "react-redux";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { getLocation, deleteLocation } from "@/redux/actions";

export default function LocationPage() {
  const adminProfile = useSelector((state: any) => state.user.adminProfile);
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [locations, setLocations] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [moveBack, setMoveBack] = useState(0);
  const [totalRecords, setTotalRecords] = useState("10");
  const [locationToDelete, setLocationToDelete] = useState({
    id: "",
    name: "",
  });
  const [filterSearch, setFilterSearch] = useState({ page: 1, search: "" });
  const debounceTimer = useRef<any>(null);

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
      setTotalRecords(data?.totalLocation);
      setLocations(data?.location);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const onSearch = (query: any) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
      setMoveBack(0);
    }
    debounceTimer.current = setTimeout(() => {
      setFilterSearch((prev) => ({ ...prev, search: query }));
      getLocationData({ page: 1, search: query });
      setMoveBack(1);
    }, 300);
  };

  const editLocation = (val: any) => {
    router.push(`/locations/edit/${val}`);
  };

  const onPageChange = (e: any) => {
    setFilterSearch((prev) => ({ ...prev, page: e }));
    getLocationData({ search: filterSearch?.search, page: e });
  };

  const deletelocation = async () => {
    try {
      showLoader();
      const res = await deleteLocation(locationToDelete?.id);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      showSuccess("Location deleted successfully");
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      getLocationData();
      setModalIsOpen(false);
      hideLoader();
    }
  };

  const columns = [
    {
      title: "Locations",
      key: "location",
      render: (item: any) => {
        return (
          <>
            <div className="flex place-items-center">
              <div
                className={`left-0 top-[0px] bg-cover bg-center border-1 flex rounded-lg overflow-hidden relative justify-center w-40 h-20 place-items-center`}
                style={{ backgroundImage: `url(${item?.image})` }}
              ></div>
              <div className="ml-2">
                <p className="text-sm font-bold text-graydark">{item?.name}</p>
                <p className="text-sm text-blue-gray-500">{item?.address}</p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "Physical gate",
      key: "physicalgate",
      render: (item: any) => {
        return <>{(item?.deviceIn?.isDeviceActive || item?.deviceIn?.isDeviceActive) ? "Yes" : "No"}</>;
      },
    },
    {
      title: "Daily price",
      key: "dailySlot",
      render: (item: any) => {
        return <>{item?.dailySlot?.price}</>;
      },
    },
    {
      title: "Monthly price",
      key: "monthlySlot",
      render: (item: any) => {
        return <>{item?.monthlySlot?.price}</>;
      },
    },
    {
      title: "Total spots",
      key: "totalSlots",
    },
    {
      title: "Spots filled",
      key: "occupiedSlots",
      render: (item: any) => {
        return (
          <>
            <p className="text-[#B54708] min-w-15.5 max-w-fit text-center border-2 border-[#DC6803] px-3 py-1 rounded-full">
              {item?.occupiedSlots}
            </p>
          </>
        );
      },
    },
    {
      title: "Empty spots",
      key: "pendingSlots",
      render: (item: any) => {
        return (
          <>
            <p className="text-[#079455] min-w-15.5 max-w-fit text-center border-2 border-[#067647] w-fit px-3 py-1 rounded-full">
              {item?.pendingSlots}
            </p>
          </>
        );
      },
    },
    adminProfile?.role == ADMIN_ROLE?.ADMIN && {
      title: "Action",
      key: "action",
      render: (item: any) => {
        return (
          <div className="flex justify-between h-5 w-15 relative">
            <div className="relative w-5">
              <Image
                onClick={() => {
                  setModalIsOpen(true);
                  setLocationToDelete({ id: item?._id, name: item?.name });
                }}
                layout="fill"
                objectFit="contain"
                className="cursor-pointer"
                src="/images/icon/delete.svg"
                alt="Logo"
              />
            </div>
            <div className="relative w-4.5">
              <Image
                onClick={() => editLocation(item?._id)}
                className="cursor-pointer"
                src="/images/icon/edit.svg"
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <header className=" mb-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between">
          <div>
            <p className="text-title-lg font-bold text-black dark:text-white">
              Locations
            </p>
          </div>
          {adminProfile.role == ADMIN_ROLE.ADMIN && (
            <div className="flex gap-2">
              <Link className="font-medium" href="/locations/create">
                <Button
                  className="bg-secondary text-white"
                  icon="/images/icon/addlocation.svg"
                >
                  Add location
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <hr className="my-6 w-full text-bordercolor" />
      <div className="flex items-center justify-between mb-5">
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
              onSearch(e?.target?.value);
            }}
          />
        </div>
        {/* <Button icon="/images/icon/filter-lines.svg">Filters</Button> */}
      </div>
      <DataTable
        columns={columns}
        data={locations}
        totalRecords={totalRecords}
        moveBack={moveBack}
        onPageChange={onPageChange}
        title={adminProfile?.role == ADMIN_ROLE?.ADMIN ? "locations" : false}
        onSearch={null}
      />

      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <div>
          <div className="text-center">
            <p className="font-bold text-md text-black">
              Delete &quot;{locationToDelete?.name}&quot;
            </p>
            <p className="text-sm">
              Are you sure you want to delete &quot;{locationToDelete?.name}
              &quot;?
            </p>
          </div>
          <div className="flex justify-between gap-2 mt-8">
            <Button
              onClick={() => setModalIsOpen(false)}
              className="w-full justify-center"
              topClassName="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={deletelocation}
              topClassName="w-1/2"
              className="w-full bg-primary text-white justify-center"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
