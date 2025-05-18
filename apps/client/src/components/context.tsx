import type { UserType } from "@/api/types";
import { getUser } from "@/api/user";
import React, { createContext, useEffect, useState } from "react";

type UserContextType = {
  user: UserType | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
  isLoading: boolean;
};

const ContextProvider = createContext<UserContextType | null>(null);

export const Context = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = getUser();
  const [user, setUser] = useState<UserType | undefined>(data);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);
  return (
    <ContextProvider.Provider value={{ user, setUser, isLoading }}>
      {children}
    </ContextProvider.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(ContextProvider);
  if (!context) {
    throw new Error("useUser must be used within a ContextProvider");
  }
  return context;
};
