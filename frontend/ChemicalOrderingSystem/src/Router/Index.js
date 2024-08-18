import { createBrowserRouter } from "react-router-dom";
import BlankLayout from "../Pages/BlankLayout";
import { routes } from "./Routes";
import Login from "../Pages/Authentication/Login";

// Map routes to apply layouts
const finalRoutes = routes.map((route) => {
  // Determine which layout to use
  const Layout = route.layout === "blank" ? BlankLayout : Login;

  return {
    ...route,
    element: <Layout>{route.element}</Layout>,
  };
});

const router = createBrowserRouter(finalRoutes);

export default router;
