import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/LandingPage/Dashboard";
import BlankLayout from "../Pages/BlankLayout";
import Users from "../Pages/Users/Users";
import Chemicals from "../Pages/Chemicals/Chemicals";

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
    path: "/chemicals",
    element: <Chemicals />,
    layout: "blank",
  },
  {
    path: "*",
    element: <BlankLayout />,
    layout: "blank",
  },
];
