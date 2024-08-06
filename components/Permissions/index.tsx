export const routePermissions: any = {
  // locations---------------
  "/locations/edit/[id]": {
    role: ADMIN_ROLE.ADMIN,
  },
  "/locations/[id]": {
    role: ADMIN_ROLE.ADMIN,
  },
  "/locations/create": {
    role: ADMIN_ROLE.ADMIN,
  },
  //drivers------------------
  "/drivers/[id]": {
    role: ADMIN_ROLE.ADMIN,
  },
  // fleet-------------------
  "/fleetmanager/create": {
    role: ADMIN_ROLE.OWNER,
  },
  "/fleetmanager/[companyid]/edit": {
    role: ADMIN_ROLE.OWNER,
  },
  "/fleetmanager/[companyid]/[driverid]/[id]": {
    role: ADMIN_ROLE.OWNER,
  },
  "/fleetmanager/[companyid]/bookfleet": {
    role: ADMIN_ROLE.OWNER,
  },
  "/fleetmanager/[companyid]/bookfleet/bookedit/[id]": {
    role: ADMIN_ROLE.OWNER,
  },
};

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ADMIN_ROLE } from "@/constant";

const withPermission = (WrappedComponent: any) => {
  const WithPermissionWrapper = (props: any) => {
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const adminProfile = useSelector((state: any) => state.user.adminProfile);

    useEffect(() => {
      const { role } = routePermissions[router.pathname] || {};
      if (!role) {
        setHasPermission(true);
        return;
      }

      if (adminProfile?.role !== role) {
        router.push("/404");
        return;
      }
      setHasPermission(true);
    }, [adminProfile]);

    if (!hasPermission) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermissionWrapper;
};

export default withPermission;
