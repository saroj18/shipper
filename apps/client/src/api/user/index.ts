import { apiClient } from "..";
import { useQuery } from "@tanstack/react-query";
import type { UserType } from "../types";

const getuser = async () => {
  const { data } = await apiClient.get("/user");
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
  const { data } = await apiClient.get("/user/logout");
  return data;
};
