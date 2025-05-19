import type { ProjectInfoType } from "@/pages/create-project";
import { apiClient } from "..";

export const deployProject = async (projectInfo:ProjectInfoType) => {
  const { data } = await apiClient.post("/project/deploy", projectInfo);
  return data;
};
