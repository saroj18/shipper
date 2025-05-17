import { Outlet } from "react-router";
import Navbar from "./components/navbar";

const ProjectDashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProjectDashboardLayout;
