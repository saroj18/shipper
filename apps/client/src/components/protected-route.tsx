import React from "react";
import { useUser } from "./context";
import Login from "@/pages/login";
import Loader from "./loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <Loader />;
  }
  console.log(user);
  return user ? children : <Login />;
};

export default ProtectedRoute;
