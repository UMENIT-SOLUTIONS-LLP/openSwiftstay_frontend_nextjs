import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import useLoader from "@/hooks/useLoader";
import TextInput from "@/components/UI/TextInput";
import DataTable from "@/components/UI/Tables/DataTable";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "@/utils/helper";
import Image from "next/image";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modals/Modal";
import {
  assignDriver,
  checkUser,
  companyDriver,
  createUser,
  deleteFleetDriver,
} from "@/redux/actions";
import UserAvatar from "@/components/UI/UserAvatar";
import moment from "moment-timezone";
import PhoneInputBox from "@/components/UI/PhoneInputBox";
import { parsePhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/constant";

const FleetManagerDriver = ({ id = "" }: any) => {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [driversData, setDriversData] = useState([]);
  const [totalRecords, setTotalRecords] = useState("10");
  const [moveBack, setMoveBack] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const adminProfile = useSelector((state: any) => state.user.adminProfile);
  const [addDriverModal, setAddDriverModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState({ id: "", name: "" });
  const [userNotExist, setUserNotExist] = useState(false);
  const [driverPhoneNo, setDriverPhoneNo] = useState<any>({});
  const [filterSearch, setFilterSearch] = useState({ search: "", page: 1 });
  const debounceTimer = useRef<any>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      phoneNo: "",
      dialCode: "",
      companyId: "",
      ISOCode: "US",
    },
  });

  const getCompanyDriverData = async ({
    page = 1,
    limit = 10,
    search = "",
  } = {}) => {
    try {
      showLoader();
      const res = await companyDriver({ page, limit, search, companyId: id });
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setTotalRecords(data?.totalDriver);
      setDriversData(data?.driver);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getCompanyDriverData();
  }, []);

  const onPageChange = (e: any) => {
    setFilterSearch((prev) => ({ ...prev, page: e }));
    getCompanyDriverData({ search: filterSearch?.search, page: e });
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
      let postData = {
        phoneNo: phoneNumber,
        dialCode,
        companyId: id,
        ISOCode: formData?.ISOCode,
      };
      const res = await checkUser(postData);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      const { isUser, user } = data || {};
      if (isUser) {
        const res = await assignDriver({ ...postData, userId: user?._id });
        const { status, data, message } = res || {};
        if (!status) {
          const { message } = data;
          showError(message, "Error!");
          return;
        }
        showSuccess(message || "Driver has been added");
        getCompanyDriverData({ ...filterSearch });
        closeAddOwnerModal();
      } else {
        setDriverPhoneNo(postData);
        setUserNotExist(true);
      }
      reset();
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const handleFormSubmit1 = async (formData: any) => {
    try {
      showLoader();
      const { phoneNo, dialCode, ISOCode } = driverPhoneNo || {};
      const { name } = formData || {};
      const postData = {
        phoneNo,
        dialCode,
        name,
        ISOCode,
      };
      const res = await createUser(postData);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      const res1 = await assignDriver({ companyId: id, userId: data?._id });
      const { message } = res1 || {};
      if (!res1?.status) {
        const { message } = res1?.data ?? {};
        showError(message, "Error!");
        return;
      }
      showSuccess(message || "Driver has been added");
      getCompanyDriverData({ ...filterSearch });
      closeAddOwnerModal();
      reset();
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const onSearch = (query: any) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
      setMoveBack(0);
    }
    debounceTimer.current = setTimeout(() => {
      setFilterSearch((prev) => ({ ...prev, search: query }));
      getCompanyDriverData({ page: 1, search: query });
      setMoveBack(1);
    }, 300);
  };

  const editDriver = (val: any) => {
    router.push(`/fleetmanager/${id}/${val?._id}`);
  };

  const deleteDriver = (val: any) => {
    setDriverToDelete({ id: val?._id, name: val?.userId?.name });
    setModalIsOpen(true);
  };

  const runDeleteDriver = async () => {
    try {
      showLoader();
      const res = await deleteFleetDriver(
        {
          companyId: id,
        },
        driverToDelete?.id
      );
      const { status, data, message } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      showSuccess(message || "Driver deleted successfully");
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      getCompanyDriverData();
      setModalIsOpen(false);
      hideLoader();
    }
  };

  const modelClose = () => {
    setModalIsOpen(false);
  };

  const closeAddOwnerModal = () => {
    setAddDriverModal(false);
    setDriverPhoneNo({});
    reset();
    setUserNotExist(false);
  };

  const columns = [
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
              <p className="text-sm font-bold text-graydark">
                {item?.userId?.name}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Phone number",
      key: "phoneNo",
      render: (item: any) => {
        return (
          <>
            {item?.userId?.dialCode} {item?.userId?.phoneNo}
          </>
        );
      },
    },
    {
      title: "Upcoming/Active booking",
      key: "upcomingBookings",
      render: (item: any) => {
        return (
          <div className="text-center">
            {item?.upcommingBookingsCount + item?.activeBookingsCount || "0"}
          </div>
        );
      },
    },
    {
      title: "Past booking",
      key: "pastBookings",
      render: (item: any) => {
        return (
          <div className="text-center">
            {item?.completedBookingsCount || "0"}
          </div>
        );
      },
    },
    {
      title: "Created Date",
      key: "registration_dt",
      render: (item: any) => {
        return <>{moment(item?.createdAt).format("DD MMM YYYY hh:mm A")}</>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) => {
        if (!item?.isBlocked) {
          return (
            <p className="text-[#079455] flex items-center w-25 justify-center  border text-sm  bg-success200 border-1 relative border-[#067647] px-3 py-1 rounded-full pl-6">
              <span className="absolute left-2 w-1.5 h-1.5 bg-[#079455] rounded-full" />
              Active
            </p>
          );
        } else {
          return (
            <p className="text-blue-gray-800 flex w-25 justify-center items-center text-sm border bg-[#F9FAFB] border-1 relative border-[#EAECF0] px-3 py-1 rounded-full pl-6">
              <span className="absolute left-2 w-1.5 h-1.5 bg-blue-gray-800 rounded-full" />
              Blocked
            </p>
          );
        }
      },
    },
    adminProfile?.role == ADMIN_ROLE?.OWNER && {
      title: "Actions",
      key: "action",
      render: (item: any) => {
        return (
          <div className="flex justify-between h-5 w-15 relative">
            <div className="relative w-5">
              <Image
                onClick={() => deleteDriver(item)}
                className="cursor-pointer"
                src="/images/icon/delete.svg"
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-4.5">
              <Image
                onClick={() => editDriver(item)}
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
      <div className="flex items-center justify-between my-6">
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
          />
        </div>
        {adminProfile?.role == ADMIN_ROLE?.OWNER && (
          <Button
            onClick={() => setAddDriverModal(true)}
            className="bg-secondary text-white"
            icon="/images/icon/addlocation.svg"
          >
            Add driver
          </Button>
        )}
        {/* <Button icon="/images/icon/filter-lines.svg">Filters</Button> */}
      </div>
      <DataTable
        columns={columns}
        data={driversData}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        moveBack={moveBack}
        title={`fleetmanager/${id}`}
        onSearch={null}
      />
      <Modal
        className="lg:w-1/4"
        open={addDriverModal}
        onClose={closeAddOwnerModal}
      >
        {!userNotExist ? (
          <div>
            <div className="mb-4">
              <p className="font-bold text-md text-black">Add driver</p>
              <p className="text-sm mt-2">
                Please enter driver phone number below
              </p>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div>
                <PhoneInputBox
                  label="Phone*"
                  control={control}
                  name="phoneNo"
                  errors={errors}
                  setValue={setValue}
                  rules={{
                    required: "Please enter the phone number",
                  }}
                />
              </div>
              <div className="flex justify-between gap-2 mt-8">
                <Button
                  onClick={closeAddOwnerModal}
                  className="w-full justify-center"
                  type="button"
                  topClassName="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  topClassName="w-1/2"
                  className="w-full bg-primary text-white justify-center"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="font-bold text-md text-black">
                Tell me about driver
              </p>
              <p className="text-sm mt-2">Please enter your driver name</p>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit1)}>
              <div>
                <TextInput
                  placeholder="Full name"
                  type="text"
                  name="name"
                  control={control}
                  errors={errors}
                  labelClassName="text-sm font-bold text-blue-gray-600"
                  className="text-md"
                  label="Full name*"
                  rules={{
                    required: "Please enter name",
                  }}
                />
              </div>
              <div className="flex justify-between gap-2 mt-8">
                <Button
                  type="submit"
                  topClassName="w-full"
                  className="w-full bg-primary text-white justify-center py-3"
                >
                  continue
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={modelClose}>
        <div>
          <div className="text-center">
            <p className="font-bold text-md text-black">
              Delete &quot;{driverToDelete?.name}&quot;
            </p>
            <p className="text-sm">
              Are you sure you want to delete &quot;{driverToDelete?.name}
              &quot;?
            </p>
          </div>
          <div className="flex justify-between gap-2 mt-8">
            <Button
              onClick={modelClose}
              className="w-full justify-center"
              topClassName="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={runDeleteDriver}
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
};

export default FleetManagerDriver;
