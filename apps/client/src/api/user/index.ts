import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../types";
import { apiClientMainServer } from "..";

const getuser = async () => {
  const { data } = await apiClientMainServer.get("/user");
  return data;
};

export const getUser = () => {
  return useQuery<UserType>({
    queryKey: ["user"],
    queryFn: getuser,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
export const logoutUser = async () => {
  const { data } = await apiClientMainServer.get("/user/logout");
  return data;
};
