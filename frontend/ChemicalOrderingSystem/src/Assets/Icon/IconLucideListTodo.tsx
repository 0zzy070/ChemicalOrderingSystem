import * as React from "react";

// By: lucide
// See: https://v0.app/icon/lucide/list-todo
// Example: <IconLucideListTodo width="24px" height="24px" style={{color: "#000000"}} />

export const IconLucideListTodo = ({
  height = "1em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <rect width="6" height="6" x="3" y="5" rx="1" />
      <path d="m3 17l2 2l4-4m4-9h8m-8 6h8m-8 6h8" />
    </g>
  </svg>
);

export default IconLucideListTodo;