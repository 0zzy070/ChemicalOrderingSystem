import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/LandingPage/Dashboard";
import BlankLayout from "../Layouts/BlankLayout";
import Users from "../Pages/Users/Users";
import Location from "../Pages/Locations/Location";
import Chemicals from "../Pages/Chemicals/Chemicals";
import Institutes from "../Pages/Locations/Location";
import StorageLocations from "../Pages/Locations/StorageLocations";
import ResearchCentres from "../Pages/Locations/ResearchCentres";
import Laboratories from "../Pages/Locations/Laboratories";
import Approvals from "../Pages/Approvals/Approvals";
import HigherApprovals from "../Pages/HigherApprovals/HigherApprovals";
import Experiments from "../Pages/Experiments/Experiments";
import Orders from "../Pages/Orders/Orders";

// ProtectedRoute to ensure only authenticated users can access certain routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("auth"));
  const userRoles = user?.userRole || [];
  if (!auth?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />; // Redirect to a "Not Authorized" page
  }

  return children;
};

// PublicRoute to ensure that authenticated users cannot access the login page
const PublicRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Define your routes
export const routes = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    layout: "default", // Will use DefaultLayout
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <Users />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/location",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <Location />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/institutes",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <Institutes />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/storagelocations/:id",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <StorageLocations />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/researchcentre/:id",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_RESEARCH"]}>
        <ResearchCentres />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/laboratory/:id",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <Laboratories />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/chemicals",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <Chemicals />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/approvals",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_SUPERVISOR"]}>
        <Approvals />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/higherApprovals",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_APPROVE"]}>
        <HigherApprovals />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ORDER"]}>
        <Orders />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "/experiments",
    element: (
      <ProtectedRoute allowedRoles={["ROLE_RESEARCH"]}>
        <Experiments />
      </ProtectedRoute>
    ),
    layout: "blank", // Will use BlankLayout
  },
  {
    path: "*",
    element: <BlankLayout />,
    layout: "blank", // Will use BlankLayout
  },
];
