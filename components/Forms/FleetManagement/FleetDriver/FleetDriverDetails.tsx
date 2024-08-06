/* eslint-disable @next/next/no-img-element */
import Button from "@/components/UI/Button";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import UserAvatar from "@/components/UI/UserAvatar";
import SwitcherOne from "@/components/UI/Switchers/SwitcherOne";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/constant";

const FleetDriverDetails = ({
  companyid = "",
  driverid = "",
  driverData,
  handleApiCall,
  isBlocked,
}: any) => {
  const adminProfile = useSelector((state: any) => state.user.adminProfile);

  return (
    <>
      <div className="my-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between">
          <div className="flex gap-6">
            <div className="h-[70px] w-[70px]">
              <UserAvatar
                className="overflow-hidden relative justify-center bg-cover border-white w-20 h-20 place-items-center border-4 shadow-md"
                image={driverData?.userId?.image}
                name={driverData?.userId?.name || ""}
              />
            </div>
            <div className="flex flex-col gap-1 self-center">
              <p className="text-title-sm md:text-title-md lg:text-title-lg font-bold text-black dark:text-white">
                {driverData?.userId?.name}
              </p>
              <p className="text-[#079455] flex items-center w-25 justify-center  border text-sm  bg-success200 border-1 relative border-[#067647] px-3 py-1 rounded-full pl-6">
                <span className="absolute left-2 w-1.5 h-1.5 bg-[#079455] rounded-full" />
                Active
              </p>
            </div>
          </div>

          {adminProfile?.role == ADMIN_ROLE?.OWNER && (
            <div className="flex gap-2 items-center">
              <SwitcherOne
                val1="Unblock"
                val2="Block"
                isBlocked={isBlocked}
                onSwitched={handleApiCall}
              />
              <Link
                className="font-medium"
                href={`/fleetmanager/${companyid}/${driverid}/${driverData?.userId?._id}`}
              >
                <Button className="bg-secondary text-white">Edit</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <hr className="my-6 w-full text-bordercolor" />
      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Status
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <CardDataStats
          title="Upcoming/Active booking"
          total={driverData?.upcomingBookingsCount + driverData?.activeBookingsCount}
          type=""
          value={"2%"}
        />
        <CardDataStats
          title="Past booking"
          total={driverData?.completedBookingsCount}
          type=""
          value={"10%"}
        />
      </div>

      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Details
      </p>

      <div className="rounded-xl border border-stroke bg-white py-4 px-5 shadow-card flex items-center gap-5">
        <div className="text-sm w-full gap-6 flex flex-col justify-between">
          <div>
            <p className="text-black-2">Phone number</p>
            <p>{driverData?.userId?.dialCode} {driverData?.userId?.phoneNo}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FleetDriverDetails;
