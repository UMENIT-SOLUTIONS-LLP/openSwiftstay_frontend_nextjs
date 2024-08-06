import Image from "next/image";
import { IoChevronDown } from "react-icons/io5";

const DropdownUser = () => {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 cursor-pointer">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Admin
          </span>
          <span className="block text-xs">Super Admin</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={"/images/user/avatar.png"}
            alt="User"
          />
        </span>

        <span className="hidden fill-current sm:block">
          <IoChevronDown />
        </span>
      </div>
    </div>
  );
};

export default DropdownUser;
