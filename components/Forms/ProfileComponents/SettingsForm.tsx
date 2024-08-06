import React, { useState, useEffect } from "react";
import { showError, showSuccess } from "@/utils/helper";
import useLoader from "@/hooks/useLoader";
import SwitcherOne from "@/components/UI/Switchers/SwitcherOne";
import { getDriverByID, updateDriver } from "@/redux/actions";

const Settings = ({ id }: any) => {
  const { showLoader, hideLoader } = useLoader();
  const [isBlocked, setIsBlocked] = useState(false);

  const fetchUserProfile = async (id: any) => {
    try {
      showLoader();
      const res = await getDriverByID(id);
      const { data, status } = res || {};
      if (!status) {
        return;
      }
      const { name, isBlocked } = data || {};
      setIsBlocked(isBlocked);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchUserProfile(id);
  }, [id]);

  const handleApiCall = async (enabled: boolean) => {
    try {
      showLoader();
      const resProfile = await updateDriver({ isBlocked: enabled }, id);
      const { data, status, message } = resProfile || {};
      if (!status) {
        showError(message);
        return;
      }
      const { _id } = data;
      fetchUserProfile(_id);
      showSuccess(message);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
        <div className="rounded-xl justify-between border border-white bg-white py-4 px-5 shadow-card flex items-center gap-5">
          <div className="mt-2 w-3/4 md:w-2/3 lg:w-1/3 flex flex-col justify-between">
            <div className="flex flex-row h-8 justify-between font-bold text-black dark:text-white">
              Block/Unblock the Driver
            </div>
            <div>
              <span className="text-sm font-medium">
                As an administrator you can control the drivers who have access
                to the parking lot
              </span>
            </div>
          </div>
          <SwitcherOne
            val1="Unblock"
            val2="Block"
            isBlocked={isBlocked}
            onSwitched={handleApiCall}
          />
        </div>
      </div>
    </>
  );
};

export default Settings;
