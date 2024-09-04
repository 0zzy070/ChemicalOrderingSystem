import React from "react";

const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <main>{children}</main>
    </div>
  );
};

export default DefaultLayout;
