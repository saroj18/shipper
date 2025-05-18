import React from "react";
import { useUser } from "./context";
import Home from "@/pages/home";
import Loader from "./loader";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <Loader/>;
  }
  return user ? <Home/>: children;
};

export default PublicRoute;
