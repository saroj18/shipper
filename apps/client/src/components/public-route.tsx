import React from "react";
import { useUser } from "./context";
import Home from "@/pages/home";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return user ? <Home/>: children;
};

export default PublicRoute;
