import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/LandingPage/Dashboard";
import BlankLayout from "../Pages/BlankLayout";
import Users from "../Pages/Users/Users";
import Location from "../Pages/Locations/Location";
import Chemical from "../Pages/Chemicals/Chemical";

/* 
const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!auth?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}; 
*/

export const routes = [
  {
    path: "/",
    element: <Login />,
    layout: "default",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    layout: "blank",
  },
  {
    path: "/users",
    element: <Users />,
    layout: "blank",
  },
  {
    path: "/location",
    element: <Location />,
    layout: "blank",
  },
  {
    path: "/chemical",
    element: <Chemical />,
    layout: "blank",
  },
  {
    path: "*",
    element: <BlankLayout />,
    layout: "blank",
  },
];
