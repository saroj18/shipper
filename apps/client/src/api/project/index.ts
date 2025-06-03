import type { ProjectInfoType } from '@/pages/create-project';
import { apiClient } from '..';
import { useQuery } from '@tanstack/react-query';

export const deployProject = async (projectInfo: ProjectInfoType) => {
  const { data } = await apiClient.post('/project/deploy', projectInfo);
  return data;
};

const getProjectInfo = async (id: string) => {
  const { data } = await apiClient.get(`/project/info/?payload=${id}`);
  return data;
};

export const useProjectInfo = <T>(id: string) => {
  return useQuery<T>({
    queryKey: ['projectInfo', id],
    queryFn: () => getProjectInfo(id),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
