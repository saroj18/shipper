import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  activeItem?: string;
}

const Navbar = ({ activeItem }: NavbarProps) => {
  const [active, setActive] = useState(activeItem || "Analytics");

  const navItems: NavItem[] = [
    { label: "Project", href: "/project-dashboard" },
    { label: "Deployments", href: "deployment" },
    { label: "Logs", href: "logs" },
    { label: "Settings", href: "settings" },
  ];

  return (
    <nav className="bg-black border-b border-zinc-800 ">
      <div className=" mx-auto px-4">
        <div className="flex overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "px-4 py-4 text-lg font-medium whitespace-nowrap transition-colors relative",
                active === item.label
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
              onClick={() => setActive(item.label)}
            >
              {item.label}
              {active === item.label && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
