"use client";
import { useState, useEffect } from "react";

const SwitcherOne = ({ val1, val2, isBlocked, onSwitched }: any) => {
  // const [enabled, setEnabled] = useState<boolean>(isBlocked);

  // useEffect(() => {
  //   onSwitched(enabled);
  // }, [enabled]);

  return (
    <div>
      <label
        htmlFor="toggle1"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle1"
            className="sr-only"
            onChange={() => {
              onSwitched(!isBlocked);
            }}
          />
          <div
            className={`block h-5 w-10 rounded-full bg-meta-9 dark:bg-[#5A616B] ${
              isBlocked && "bg-primary"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition ${
              isBlocked &&
              "right-0 left-3 !translate-x-full !bg-white dark:!bg-white"
            }`}
          ></div>
        </div>
        {isBlocked ? (
          <p className="text-sm text-graydark ml-3 w-14">{val1}</p>
        ) : (
          <p className="text-sm text-graydark ml-3 w-14">{val2}</p>
        )}
      </label>
    </div>
  );
};

export default SwitcherOne;
