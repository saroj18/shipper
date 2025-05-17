"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

interface SidebarItem {
  name: string;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
}

const Sidebar = ({ activeItem = "General" }: SidebarProps) => {
  const [active, setActive] = useState(activeItem);
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems: SidebarItem[] = [
    { name: "General", href: "" },
    { name: "Build and Deployment", href: "build-script" },
    { name: "Domains", href: "domains" },
    { name: "Environment Variables", href: "environment-variables" },
  ];

  const filteredItems = sidebarItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-90 h-screen bg-black border-r border-zinc-800 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {filteredItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-lg transition-colors",
                  active === item.name
                    ? "text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
                onClick={(e) => {
                //   e.preventDefault();
                  setActive(item.name);
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
