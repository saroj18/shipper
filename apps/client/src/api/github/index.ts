import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";

export const getAllRepos = async () => {
  const {data} = await apiClient.get("/github/repos");
  return data;
};


export const userGithubRepos= ()=>{
  return useQuery({
    queryKey: ["userGithubRepos"],
    queryFn: getAllRepos,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}