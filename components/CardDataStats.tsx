import React, { ReactNode } from "react";
import Image from "next/image";
import classNames from "classnames";

interface CardDataStatsProps {
  title: string;
  total: any;
  value?: string;
  totalClassName?: string;
  headingClassName?: string;
  type: string;
  children?: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  value,
  totalClassName,
  headingClassName,
  type,
  children,
}) => {
  return (
    <div className="rounded-xl border border-stroke bg-white py-4 px-5 shadow-card flex items-center gap-5">
      <div
        className={classNames(
          headingClassName,
          "mt-2 w-full flex flex-col justify-between"
        )}
      >
        <div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex flex-row min-h-[48px] justify-between">
          <h4
            className={classNames(
              totalClassName,
              "text-title-lg self-center font-bold text-black dark:text-white"
            )}
          >
            {total}
          </h4>
          {type && (
            <div
              className={classNames(
                {
                  "bg-success200": type === "success",
                  "bg-error200": type === "error",
                },
                "flex h-6.5 w-15.5 items-center justify-center rounded-xl"
              )}
            >
              <Image
                width={12}
                height={20}
                src={
                  type == "success"
                    ? "/images/icon/arrow-up.svg"
                    : "/images/icon/arrow-down.svg"
                }
                alt="Logo"
              />
              <span
                className={
                  type == "success" ? "text-success700" : "text-error700"
                }
              >
                {value}
                {children}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
