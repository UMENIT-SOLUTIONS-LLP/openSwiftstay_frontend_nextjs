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
  openBottom,
  leftIcon,
  rightIcon,
  disabled,
  className,
  labelClassName,
  optionSelected,
  label,
}: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(defaultValue || []);
  const dropdown = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (!defaultValue && options && defaultValue.length == 0) return;

    let defaultValues = defaultValue || [];

    let filteredValues = options.filter((item: any) =>
      defaultValues.includes(item._id.toString())
    );
    setSelectedOptions(filteredValues.map((item: any) => item._id));
  }, [defaultValue, options]);

  const handleOptionClick = (option: { _id: string; name: string }) => {
    const isSelected = selectedOptions.includes(option._id);
    const updatedOptions = isSelected
      ? selectedOptions.filter((selected: any) => selected !== option._id)
      : [...selectedOptions, option._id];

    setSelectedOptions(updatedOptions);
    optionSelected(updatedOptions);
  };

  return (
    <div className="relative" ref={dropdown}>
      <Controller
        render={({ field: { onChange, onBlur } }) => (
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
            <div className="relative max-w-70">
              <ul
                className={classNames(
                  {
                    "opacity-100 z-0 translate-y-[50px]":
                      dropdownOpen && openBottom,
                    "opacity-100 z-0 -translate-y-[105%]":
                      dropdownOpen && !openBottom,
                    "opacity-0 -z-1 -translate-y-10": !dropdownOpen,
                    "opacity-0 -z-1 -translate-y-0":
                      !dropdownOpen && openBottom,
                  },
                  "flex flex-col w-full absolute max-h-80 border-stroke overflow-auto  border bg-white rounded-lg transition-all ease-in-out duration-200 transform scale-y-100"
                )}
              >
                {options.map(
                  (item: { _id: string; name: string }, index: number) => (
                    <li
                      key={index}
                      value={item.name}
                      className={classNames(
                        "py-2 pl-4 relative truncate transition-all duration-300 dropdown-item cursor-pointer hover:bg-stroke",
                        selectedOptions.includes(item._id) &&
                          "bg-primary text-white"
                      )}
                      onClick={() => handleOptionClick(item)}
                      tabIndex={0}
                      onKeyDown={() => handleOptionClick(item)}
                    >
                      {item.name}
                      <div
                        style={{
                          content: "",
                          height: "1px",
                          left: "15px",
                          right: "15px",
                          position: "absolute",
                          bottom: "0",
                          background: "#eaecf0",
                        }}
                      ></div>
                    </li>
                  )
                )}
              </ul>
              <div
                className={classNames(
                  "cursor-pointer min-w-42.5 w-full flex select-none appearance-none transition-all duration-300 transform scale-y-100 rounded-lg border relative text-black border-stroke bg-white py-2 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none",
                  className
                )}
                onClick={toggleDropdown}
                tabIndex={0}
                onKeyDown={toggleDropdown}
              >
                {leftIcon && (
                  <div className="relative left-0 right-3 mr-3 self-center flex items-center h-full">
                    {selectedOptions.length > 0 ? (
                      <div
                        className="text-red-400 cursor-pointer font-bold"
                        onClick={() => {
                          optionSelected([]);
                          setSelectedOptions("");
                        }}
                        tabIndex={0}
                        onKeyDown={() => {
                          optionSelected([]);
                          setSelectedOptions("");
                        }}
                      >
                        X
                      </div>
                    ) : (
                      leftIcon
                    )}
                  </div>
                )}
                <div className="truncate ...">
                  {selectedOptions.length > 0 ? (
                    selectedOptions
                      .slice(0, 2)
                      ?.map((optionId: string, index: number) => (
                        <>
                          {
                            options.find((opt: any) => opt._id === optionId)
                              ?.name
                          }
                          {index > 0 && selectedOptions.length > 2 && " ... "}
                          {index < selectedOptions.length - 1 &&
                            index === 0 &&
                            ", "}
                        </>
                      ))
                  ) : (
                    <div className="text-gray-500 truncate">{placeholder}</div>
                  )}
                </div>
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
