/* eslint-disable @next/next/no-img-element */

import useLoader from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import { showError, showSuccess } from "@/utils/helper";
import Link from "next/link";
import CardDataStats from "@/components/CardDataStats";
import { getCompanyByID } from "@/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/constant";
import UserAvatar from "@/components/UI/UserAvatar";

const CompanyDetails = ({ setBreadName, id = "" }: any) => {
  const { showLoader, hideLoader } = useLoader();
  const [companyData, setCompanyData] = useState<any>({});
  const dispatch = useDispatch();
  const adminProfile = useSelector((state: any) => state.user.adminProfile);

  const getCompanyById = async (id: any) => {
    try {
      showLoader();
      const res = await getCompanyByID(id);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setBreadName(data?.name);
      setCompanyData(data);
      dispatch({
        type: "SET_COMPANY",
        payload: { companyFleet: data },
      });
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getCompanyById(id);
  }, [id]);

  return (
    <>
      <div className="my-4 top-0 z-20 flex w-full dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between">
          <div className="flex gap-4">
            <div className="h-[80px] w-[80px]">
              <UserAvatar
                image={companyData?.image}
                name={companyData?.name || ""}
                size={80}
                fontSize={16}
                className="rounded-md shadow-md"
              />
            </div>
            <div className="flex flex-col gap-1 self-center">
              <p className="text-title-sm md:text-title-md lg:text-title-lg font-bold text-black dark:text-white">
                {companyData?.name}
              </p>
              {!companyData?.isBlocked ? (
                <p className="text-[#079455] flex items-center w-25 justify-center  border text-sm  bg-success200 border-1 relative border-[#067647] px-3 py-1 rounded-full pl-6">
                  <span className="absolute left-2 w-1.5 h-1.5 bg-[#079455] rounded-full" />
                  Active
                </p>
              ) : (
                <p className="text-blue-gray-800 flex w-25 justify-around items-center text-sm border bg-[#F9FAFB] border-1 relative border-[#EAECF0] px-3 py-1 rounded-full pl-6">
                  <span className="absolute left-2 w-1.5 h-1.5 bg-blue-gray-800 rounded-full" />
                  Blocked
                </p>
              )}
            </div>
          </div>

          {adminProfile?.role == ADMIN_ROLE?.OWNER && (
            <div className="flex gap-2">
              {/* <Button>Block/unblock</Button> */}
              <Link className="font-medium" href={`/fleetmanager/${id}/edit`}>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Active drivers"
          total={companyData?.activeDriversCount}
          value={"12%"}
          type=""
        />
        <CardDataStats
          title="Ongoing booking"
          total={companyData?.activeBookingsCount}
          type=""
          value={"2%"}
        />
        <CardDataStats
          title="Past booking"
          total={companyData?.completedBookingsCount}
          type=""
          value={"10%"}
        />
      </div>

      <p className="text-title-sm font-semibold my-4 text-black dark:text-white">
        Details
      </p>

      <div className="rounded-xl border border-stroke bg-white py-4 px-5 shadow-card flex items-center gap-5">
        <div className="text-sm w-full gap-6 flex flex-col justify-between">
          <div className="grid grid-cols-2">
            <div>
              <p className="text-black-2">Contact person</p>
              <p>{companyData.person}</p>
            </div>
            <div>
              <p className="text-black-2">Email address</p>
              <p>{companyData.email}</p>
            </div>
          </div>
          <div>
            <p className="text-black-2">Phone number</p>
            <p>
              {companyData.dialCode} {companyData.phoneNo}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
