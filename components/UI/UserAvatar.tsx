import classNames from "classnames";
import React from "react";

export default function UserAvatar({
  name,
  image,
  fontSize = 30,
  size = 80,
  className,
}: any) {
  const getInitials = (name: string) => {
    if (!name) return "";

    const names = name?.split(" ")?.filter((n: string) => n);
    let initials = "";
    names.forEach((n) => {
      initials += n[0];
    });
    // keep only two initials
    if (initials.length > 2) {
      initials = initials.slice(0, 2);
    }
    return initials;
  };

  return (
    <>
      {image ? (
        <div
          className={classNames(
            className,
            "bg-primary h-full w-full rounded-full bg-cover bg-center"
          )}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ) : (
        <div
          className={classNames(
            className,
            "bg-primary flex items-center justify-center space-x-2 rounded-full"
          )}
          style={{ width: size, height: size }}
        >
          {name && (
            <span className="text-white" style={{ fontSize: fontSize }}>
              {getInitials(name)}
            </span>
          )}
        </div>
      )}
    </>
  );
}
