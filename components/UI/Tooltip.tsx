import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Tooltip(props: any) {
  const tooltipId = props["data-tooltip-id"];
  return (
    <>
      <a {...props}>{props.children}</a>
      <ReactTooltip
        id={tooltipId}
        className="rc-tooltip"
        wrapper={"div"}
        html={props.children}
      />
    </>
  );
}
