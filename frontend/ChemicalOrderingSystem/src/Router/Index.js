import { createBrowserRouter } from "react-router-dom";
import BlankLayout from "../Layouts/BlankLayout";
import { routes } from "./Routes";
import DefaultLayout from "../Layouts/DefaultLayout";

// Map routes to apply layouts
const finalRoutes = routes.map((route) => {
  // Determine which layout to use
  const Layout = route.layout === "blank" ? BlankLayout : DefaultLayout;

  return {
    ...route,
    element: <Layout>{route.element}</Layout>,
  };
});

const router = createBrowserRouter(finalRoutes);

export default router;
