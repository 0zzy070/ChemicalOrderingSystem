import * as React from "react";

// By: ph
// See: https://v0.app/icon/ph/archive-box-fill
// Example: <IconPhArchiveBoxFill width="24px" height="24px" style={{color: "#000000"}} />

export const IconPhArchiveBoxFill = ({
  height = "1em",
  fill = "currentColor",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="m223.16 68.42l-16-32A8 8 0 0 0 200 32H56a8 8 0 0 0-7.16 4.42l-16 32A8.08 8.08 0 0 0 32 72v136a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V72a8.08 8.08 0 0 0-.84-3.58m-57.5 89.24l-32 32a8 8 0 0 1-11.32 0l-32-32a8 8 0 0 1 11.32-11.32L120 164.69V104a8 8 0 0 1 16 0v60.69l18.34-18.35a8 8 0 0 1 11.32 11.32M52.94 64l8-16h134.12l8 16Z"
    />
  </svg>
);
export default IconPhArchiveBoxFill;