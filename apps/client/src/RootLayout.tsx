import { Outlet } from "react-router";
import Navbar from "./components/nav-bar";
import Footer from "./components/footer";

const RootLayout = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
