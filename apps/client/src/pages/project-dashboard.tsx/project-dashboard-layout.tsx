import { Outlet } from "react-router";
import Navbar from "./pages/dashboard/components/navbar";

const ProjectDashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProjectDashboardLayout;
