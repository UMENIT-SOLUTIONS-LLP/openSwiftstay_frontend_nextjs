/* eslint-disable @next/next/no-img-element */
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/router";
import useLoader from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import ErrorPage from "next/error";
import Button from "@/components/UI/Button";
import { showError, showSuccess } from "@/utils/helper";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import Image from "next/image";
import { downloadDeviceFile, getLocationByID } from "@/redux/actions";
import withPermission from "@/components/Permissions";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/constant";

const LocationPage = () => {
  const { showLoader, hideLoader } = useLoader();
  const adminProfile = useSelector((state: any) => state.user.adminProfile);
  const [locationData, setLocationData] = useState({
    name: "",
    address: "",
    amenities: "",
    mapLink: "",
    image: "",
    totalSlots: 0,
    creditCardFee: 0,
    salesTax: 0,
    convenienceFee: 0,
    occupiedSlots: 0,
    pendingSlots: 0,
    ownerName: "",
    deviceIn: { isDeviceActive: false },
    deviceOut: { isDeviceActive: false },
    dailySlot: {
      price: 0,
      extendPrice: 0,
    },
    monthlySlot: {
      price: 0,
      extendPrice: 0,
    },
    clientId: { name: "" },
    _id: "",
  });

  const router = useRouter();
  const { id } = router.query;

  const getLocationById = async (id: any) => {
    try {
      showLoader();
      const res = await getLocationByID(id);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setLocationData(data);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getLocationById(id);
  }, [id]);

  return (
    <>
      <Breadcrumb
        pages={[
          { name: "Locations", url: `/locations` },
          {
            name: locationData?.name,
            url: `/locations/${id}`,
            active: true,
          },
        ]}
      />
      <header className=" mb-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between">
          <div>
            <p className="text-title-sm md:text-title-md lg:text-title-lg font-bold text-black dark:text-white">
              {locationData?.name}
            </p>
            <span className="flex">
              <Image
                width={12}
                height={12}
                className="mr-2"
                src="/images/icon/location.svg"
                alt="location icon"
              />
              <p>{locationData?.address}</p>
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(locationData?.mapLink, "_blank")}
              icon="/images/icon/direction.svg"
            >
              Directions
            </Button>
            {adminProfile?.role == ADMIN_ROLE?.ADMIN && (
              <Link
                className="font-medium"
                href={`/locations/edit/${locationData?._id}/`}
              >
                <Button className="bg-secondary text-white">Edit</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <div className="border border-1 flex rounded-lg overflow-hidden justify-center border-stroke max-h-50 h-50 place-items-center">
        <img
          src={locationData?.image}
          alt="Image"
          className="max-w-full bg-cover"
        />
      </div>
      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Parking Status
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total Parking Spots"
          total={locationData?.totalSlots?.toString()}
          value={"12%"}
          type=""
        />
        <CardDataStats
          title="Total Parking Spots Filled"
          total={locationData?.occupiedSlots?.toString()}
          type=""
          value={"2%"}
        />
        <CardDataStats
          title="Total Empty spots"
          total={locationData?.pendingSlots?.toString()}
          type=""
          value={"10%"}
        />
      </div>
      {locationData?.amenities && (
        <>
          <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
            Amenities
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7?.5">
            <CardDataStats
              title=""
              totalClassName="text-title-xsm"
              total={locationData?.amenities}
              type=""
            />
          </div>
        </>
      )}
      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Pricing
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <CardDataStats
          headingClassName="items-center"
          title="Daily Price"
          total={
            <div className="w-full text-center mt-3">
              <p>{locationData?.dailySlot?.price?.toString()}</p>
              <p className="text-sm font-normal text-body mt-3">
                Extension per hour price ${locationData?.dailySlot?.extendPrice}
              </p>
            </div>
          }
          type=""
        />
        <CardDataStats
          headingClassName="items-center"
          title="Monthly Price"
          total={
            <div className="w-full text-center mt-3">
              <p>{locationData?.monthlySlot?.price?.toString()}</p>
              <p className="text-sm font-normal text-body mt-3">
                Extension per hour price $
                {locationData?.monthlySlot?.extendPrice}
              </p>
            </div>
          }
          type=""
        />
      </div>
      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Fee
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          headingClassName="items-center"
          title="Credit Card Fee"
          total={locationData?.creditCardFee?.toString()}
          type=""
        />
        <CardDataStats
          headingClassName="items-center"
          title="Sales Tax"
          total={locationData?.salesTax?.toString()}
          type=""
        />
        <CardDataStats
          headingClassName="items-center"
          title="Convenience Fee"
          total={locationData?.convenienceFee?.toString()}
          type=""
        />
      </div>
      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Owner Name
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7?.5">
        <CardDataStats
          title=""
          totalClassName="text-title-xsm"
          total={locationData?.ownerName}
          type=""
        />
      </div>
      {(locationData?.deviceIn?.isDeviceActive ||
        locationData?.deviceOut?.isDeviceActive) && (
        <>
          <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
            Device
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
            <DeviceComponent type="entry" data={locationData?.deviceIn} />
            <DeviceComponent type="exit" data={locationData?.deviceOut} />
          </div>
        </>
      )}
    </>
  );
};

export default withPermission(LocationPage);

export const DeviceComponent = ({ type, data }: any) => {
  const { showLoader, hideLoader } = useLoader();
  const downloadDeviceFiles = async (filename: any) => {
    try {
      const payload = {
        folderPath: type == "entry" ? "pemEnter" : "pemExit",
        filename,
      };
      showLoader();
      const res = await downloadDeviceFile(payload);
      const resJson = filename.split(".")[filename.split(".").length - 1] == "json"
      const blob = new Blob([resJson ? JSON.stringify(res): res]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      const { message } = err || {};
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  const { deviceUserName, hostName, deviceName } = data || {};
  return (
    <div className="rounded-xl place-items-center flex flex-col border border-stroke bg-white py-8 px-13 shadow-card gap-6 text-center">
      <div className="mt-2 w-full flex gap-3 justify-center items-center">
        <Image
          src={`/images/icon/${type}.svg`}
          width={17}
          height={17}
          alt="Search Icon"
          className="w-4 h-4 text-black"
        />
        <p className="text-green-1 text-base">
          {type == "entry" ? "Entry" : "Exit"} Gate
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-green-1 text-lg">
          Device name-{" "}
          <span className="text-black text-base">{deviceName}</span>
        </p>
        <p className="text-green-1 text-lg">
          Host name- <span className="text-black text-base">{hostName}</span>
        </p>
        <p
          onClick={() => downloadDeviceFiles("Amazon-root-CA-1.pem")}
          className="text-green-1 cursor-pointer flex justify-center items-center content-center gap-3 text-lg underline"
        >
          Amazon-root-CA-1.pem{" "}
          <span>
            <Image
              src="/images/icon/cloud-download.svg"
              width={17}
              height={17}
              alt="Search Icon"
              className=" w-4 h-4 text-black"
            />
          </span>
        </p>
        <p
          onClick={() => downloadDeviceFiles("device.pem.crt")}
          className="text-green-1 cursor-pointer flex justify-center items-center content-center gap-3 text-lg underline"
        >
          device.pem{" "}
          <span>
            <Image
              src="/images/icon/cloud-download.svg"
              width={17}
              height={17}
              alt="Search Icon"
              className="w-4 h-4 text-black"
            />
          </span>
        </p>
        <p
          onClick={() => downloadDeviceFiles("private.pem.key")}
          className="text-green-1 cursor-pointer flex justify-center items-center content-center gap-3 text-lg underline"
        >
          private.pem{" "}
          <span>
            <Image
              src="/images/icon/cloud-download.svg"
              width={17}
              height={17}
              alt="Search Icon"
              className="w-4 h-4 text-black"
            />
          </span>
        </p>
        <p
          onClick={() => downloadDeviceFiles("device.json")}
          className="text-green-1 cursor-pointer flex justify-center items-center content-center gap-3 text-lg underline"
        >
          device.json{" "}
          <span>
            <Image
              src="/images/icon/cloud-download.svg"
              width={17}
              height={17}
              alt="Search Icon"
              className="w-4 h-4 text-black"
            />
          </span>
        </p>
        <p
          onClick={() => downloadDeviceFiles("code.py")}
          className="text-green-1 cursor-pointer flex justify-center items-center content-center gap-3 text-lg underline"
        >
          code.py{" "}
          <span>
            <Image
              src="/images/icon/cloud-download.svg"
              width={17}
              height={17}
              alt="Search Icon"
              className="w-4 h-4 text-black"
            />
          </span>
        </p>
      </div>
    </div>
  );
};
