import React from "react";
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/LandingPage/Dashboard";
import BlankLayout from "../Pages/BlankLayout";

export const routes = [
  {
    path: "/",
    element: <Login />,
    layout: "default", // Apply DefaultLayout
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    layout: "blank", // Apply BlankLayout
  },
  {
    path: "*",
    element: <BlankLayout />,
    layout: "blank",
  },
];
