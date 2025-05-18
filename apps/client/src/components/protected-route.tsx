import React from "react";
import { useUser } from "./context";
import Login from "@/pages/login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(user);
  return user ? children : <Login/>;
};

export default ProtectedRoute;
