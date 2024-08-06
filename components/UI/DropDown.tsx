import classNames from "classnames";
import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

export default function DropDown({
  name,
  placeholder,
  options = [{ _id: "", name: placeholder }],
  control,
  errors,
  rules,
  defaultValue,
  disabled,
  type,
  rightIcon,
  openBottom,
  className,
  labelClassName,
  optionSelected,
  label,
}: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ _id: "", name: "" });
  const dropdown = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const toggleDropdown = () => {
    if (disabled) return;
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (!defaultValue && options) return;
    let filteredValue = options.filter((item: any) => {
      return item._id.toString() === defaultValue.toString();
    });
    if (filteredValue.length < 1) return;
    setSelectedOption({
      _id: filteredValue[0]._id,
      name: filteredValue[0].name,
    });
  }, [defaultValue, options]);

  const handleOptionClick = (option: { _id: string; name: string }) => {
    if (disabled) return;
    optionSelected(option);
    setSelectedOption(option);
    setDropdownOpen(false);
  };
  return (
    <div className="w-full relative" ref={dropdown}>
      <Controller
        render={({ field: { onChange, value, onBlur } }) => (
          <>
            {label && (
              <label
                className={classNames(
                  "mb-2.5 block text-black-2 dark:text-white",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            <div className="relative z-11">
              <ul
                className={classNames(
                  {
                    "opacity-100 z-20 translate-y-[50px] ":
                      dropdownOpen && openBottom,
                    "opacity-100 z-20 -translate-y-[105%]":
                      dropdownOpen && !openBottom,
                    "opacity-0 -z-30 -translate-y-10": !dropdownOpen,
                    "opacity-0 -z-30 -translate-y-0":
                      !dropdownOpen && openBottom,
                  },
                  "flex flex-col absolute max-h-50 overflow-y-scroll shadow-xl w-full bg-white  border-stroke rounded-lg overflow-hidden transition-all ease-in-out duration-200 transform scale-y-100"
                )}
              >
                {options.map(
                  (item: { _id: string; name: string }, index: number) => (
                    <li
                      key={index}
                      value={item.name}
                      className="py-2 pl-4 border-stroke border transition-all duration-300 dropdown-item cursor-pointer hover:bg-stroke"
                      onClick={() => handleOptionClick(item)}
                      tabIndex={0}
                      onKeyDown={() => handleOptionClick(item)}
                    >
                      {item.name}
                    </li>
                  )
                )}
              </ul>
              <div
                className={classNames(
                  {
                    "!text-[#9ca3af]":
                      (placeholder && !selectedOption?.name) || disabled,
                    "cursor-not-allowed": disabled,
                  },
                  "cursor-pointer w-full appearance-none transition-all duration-300 transform scale-y-100 rounded-lg border relative text-black border-stroke bg-white py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none",
                  className
                )}
                onClick={toggleDropdown}
                tabIndex={0}
                onKeyDown={toggleDropdown}
              >
                {selectedOption?.name || placeholder || "Select an option"}
                {rightIcon && (
                  <div className="absolute right-3 top-0 flex items-center h-full">
                    {rightIcon}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        name={name}
        control={control}
        rules={rules}
      />

      {errors?.[name] && (
        <p className="text-[#f00] text-[12px] text-error">
          <span role="alert" id={`${name}Error`}>
            {errors[name]?.message}
          </span>
        </p>
      )}
    </div>
  );
}
