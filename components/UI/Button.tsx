import classNames from "classnames";
import React from "react";
import Image from "next/image";

export default function Button({
  onClick,
  type,
  disabled,
  topClassName,
  className,
  style,
  icon,
  children,
  iconRight,
  ...rest
}: any) {
  return (
    <div className={classNames(topClassName, "button")}>
      <button
        type={type}
        disabled={disabled}
        className={classNames(
          className,
          "text-sm cursor-pointer rounded-lg border border-stroke px-4 py-2 flex place-items-center text-black-2 transition hover:bg-opacity-90"
        )}
        style={style}
        onClick={onClick}
        {...rest}
      >
        {!iconRight && icon && (
          <Image width={17} height={17} className="mr-2" src={icon} alt="Logo" />
        )}
        <span>{children}</span>
        {iconRight && (
          <Image width={17} height={17} className="ml-2" src={icon} alt="Logo" />
        )}
      </button>
    </div>
  );
}
