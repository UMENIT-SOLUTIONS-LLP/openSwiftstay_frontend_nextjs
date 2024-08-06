import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/UI/Modals/Modal";
import Button from "@/components/UI/Button";
import { useSelector } from "react-redux";
import UserAvatar from "@/components/UI/UserAvatar";
import classNames from "classnames";
import { logoutUser } from "@/utils/helper";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
interface MenuItem {
  title: string;
  link: string;
  include: string;
  icon: string;
}

type Menuitems = MenuItem[];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const adminProfile = useSelector((state: any) => state.user.adminProfile);
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  let storedSidebarExpanded = "true";
  const sidebarExpanded =
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true";

  const [hoveredSidebar, setHoveredSidebar] = useState(false);

  const handleMouseEnter = () => {
    setHoveredSidebar(true);
  };

  const handleMouseLeave = () => {
    setHoveredSidebar(false);
  };
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const modelClose = () => {
    setModalIsOpen(false);
  };

  const MenuItems: Menuitems = [
    {
      title: "Dashboard",
      link: "/dashboard",
      include: "dashboard",
      icon: "/images/icon/dashboard_icon.svg",
    },
    {
      title: "Locations",
      link: "/locations",
      include: "locations",
      icon: "/images/icon/location_icon.svg",
    },
    {
      title: "Drivers",
      link: "/drivers",
      include: "drivers",
      icon: "/images/icon/drivers_icon.svg",
    },
    {
      title: "Bookings",
      link: "/booking",
      include: "booking",
      icon: "/images/icon/booking_icon.svg",
    },
    {
      title: "Fleet Management",
      link: "/fleetmanager",
      include: "fleetmanager",
      icon: "/images/icon/fleetmanager_icon.svg",
    },
    {
      title: "Transactions",
      link: "/transaction",
      include: "transaction",
      icon: "/images/icon/transaction_icon.svg",
    },
    {
      title: "Owners",
      link: "/owners",
      include: "owners",
      icon: "/images/icon/owners_icon.svg",
    },
    {
      title: "CMS",
      link: "/cms",
      include: "cms",
      icon: "/images/icon/cms_icon.svg",
    },
  ];

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <aside
      ref={sidebar}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute left-0 top-0 z-10 flex w-72 lg:w-18 h-screen flex-col overflow-y-hidden bg-primary duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hover:w-72 `}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div
        className={`flex items-center h-20 gap-2 px-4.5 py-5.5 lg:py-6.5 transition-transform`}
      >
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/images/logo/logo-dark.svg"}
            alt="Logo"
            className={classNames({ hidden: !hoveredSidebar })}
          />

          <Image
            width={35}
            height={18}
            src={"/images/logo/logo-small.svg"}
            alt="Logo"
            className={classNames({ hidden: hoveredSidebar })}
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="h-screen no-scrollbar flex justify-between flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="flex flex-col justify-between h-full px-4 lg:px-3">
          <div
            className="no-scrollbar overflow-scroll"
            style={{
              height: "calc(100vh - 180px)",
              maxHeight: "calc(100vh - 180px)",
            }}
          >
            <ul className="mb-6 flex flex-col gap-1.5">
              {MenuItems.map((val, index) => {
                if (adminProfile.permission.length > 0) {
                  const filteredData = adminProfile.permission.filter(
                    (item: any) =>
                      item.label.toLowerCase() == val.include ||
                      item.label
                        .toLowerCase()
                        .includes(val.include.toLowerCase().split(" ")[0])
                  );
                  if (filteredData.length === 0) {
                    return;
                  }
                }

                return (
                  <li key={index}>
                    <Link
                      href={val.link}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        `group rounded-md text-white relative flex items-center gap-2.5 p-2 mx-2 h-10 mb-1 font-medium duration-300 ease-in-out hover:bg-secondary`,
                        {
                          "bg-secondary":
                            pathname === val?.link ||
                            pathname?.includes(val?.include),
                        }
                      )}
                    >
                      <Image width={17} height={17} src={val.icon} alt="Logo" />
                      <span
                        className={classNames(
                          "transition-opacity lg:opacity-100 whitespace-nowrap",
                          {
                            "lg:opacity-100": hoveredSidebar,
                            "lg:opacity-0 lg:hidden": !hoveredSidebar,
                          }
                        )}
                      >
                        {val.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative overflow-hidden w-full bottom-0 ">
            <hr className="mb-4 w-full text-[#ffffff5e]" />
            <div className="group rounded-md text-white flex items-center mx-1 h-10 mb-4 font-medium duration-300 ease-in-out">
              <div className="flex place-items-center">
                <div className="h-[40px] w-[40px]">
                  <UserAvatar
                    image={adminProfile?.image}
                    name={adminProfile?.name || adminProfile.email}
                    size={40}
                    fontSize={16}
                    className="border border-stroke"
                  />
                </div>
              </div>
              <span
                className={classNames(
                  "ml-2 transition-opacity lg:opacity-100",
                  {
                    "lg:opacity-100": hoveredSidebar,
                    "lg:opacity-0 lg:hidden": !hoveredSidebar,
                  }
                )}
              >
                <p className="text-sm font-bold text-white">
                  {adminProfile.name}
                </p>
                <p className="text-sm text-[#99CDCD]">{adminProfile.email}</p>
              </span>
            </div>
            <div
              onClick={() => {
                setModalIsOpen(true);
                setHoveredSidebar(false);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setModalIsOpen(true);
                  setHoveredSidebar(false);
                }
              }}
              className="group rounded-md text-white flex items-center mx-1 h-10 mb-6 font-medium duration-300 ease-in-out cursor-pointer"
            >
              <div
                className={classNames(
                  {
                    "lg:opacity-100": !hoveredSidebar,
                    "lg:opacity-0 lg:hidden": hoveredSidebar,
                  },
                  "flex place-items-center hidden lg:block"
                )}
              >
                <Image
                  width={40}
                  height={40}
                  className="bg-secondary p-3 rounded-lg"
                  src={"/images/icon/logout.svg"}
                  alt="Logo"
                />
              </div>
              <span
                className={classNames(
                  "transition-opacity lg:opacity-100 w-3/4",
                  {
                    "lg:opacity-100": hoveredSidebar,
                    "lg:opacity-0 lg:hidden": !hoveredSidebar,
                  }
                )}
              >
                <Button
                  icon="/images/icon/logout.svg"
                  className="bg-secondary text-white w-full pl-6"
                >
                  Logout
                </Button>
              </span>
            </div>
          </div>
        </nav>
      </div>
      <Modal
        className="md:w-1/3 lg:w-1/3"
        open={modalIsOpen}
        onClose={modelClose}
      >
        <div>
          <div className="text-center flex flex-col gap-4">
            <p className="font-bold text-2xl text-black">Logout</p>
            <p className="text-lg">Are you sure you want to Logout?</p>
          </div>
          <div className="flex justify-between gap-2 mt-11">
            <Button
              onClick={modelClose}
              className="w-full justify-center text-base px-[18px] py-[10px]"
              topClassName="w-1/2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              topClassName="w-1/2"
              className="w-full bg-primary text-base text-white px-[18px] py-[10px] justify-center"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};

export default Sidebar;
