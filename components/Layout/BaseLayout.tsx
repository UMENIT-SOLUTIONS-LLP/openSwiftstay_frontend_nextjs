/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const PUBLIC_ROUTES = ["/auth/signin", "/auth/forgotpass"];

const PUBLIC_RESET_ROUTES = [
  "/reset-password",
  "/set-password",
  "/change-password",
];

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminProfile = useSelector((state: any) => state.user.adminProfile);
  const router = useRouter();
  const { pathname } = router;
  const userToken = useSelector((state: any) => state.user.adminToken);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (userToken) {
      if (
        PUBLIC_ROUTES.includes(pathname) &&
        !PUBLIC_RESET_ROUTES.includes(pathname)
      ) {
        router.push("/dashboard");
      }
      if (pathname == "/") {
        router.push("/dashboard");
      } else if (
        adminProfile.permission.length > 0 &&
        pathname != "/auth/signin"
      ) {
        let BlockedPages = adminProfile?.permission.filter((val: any) =>
          pathname.includes(val.label.toLowerCase().split(" ")[0])
        );
        if (BlockedPages.length == 0) {
          router.push("/404");
        }
      }
    } else {
      if (
        !PUBLIC_ROUTES.includes(pathname) &&
        !PUBLIC_RESET_ROUTES.includes(pathname)
      ) {
        router.push("/auth/signin");
      }
    }
  }, [userToken, adminProfile, pathname]);

  return (
    <>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          {userToken && (
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-bodybackground">
            {userToken && (
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            )}
            <main>
              <div className="mx-auto p-4 md:p-6 2xl:p-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
      <div className="loader">
        <div className="loader__content"></div>
      </div>
    </>
  );
}
