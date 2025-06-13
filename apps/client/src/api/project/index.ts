import type { ProjectInfoType } from '@/pages/create-project';
import { useQuery } from '@tanstack/react-query';
import { apiClientContainerServer, apiClientMainServer } from '..';

export const deployProject = async (projectInfo: ProjectInfoType) => {
  const { data } = await apiClientMainServer.post('/project/deploy', projectInfo);
  return data;
};

const getProjectInfo = async (id: string) => {
  const { data } = await apiClientMainServer.get(`/project/info/?payload=${id}`);
  return data;
};

export const deleteProject = async (id: string) => {
  console.log('sora');
  const payload = id.replace('/', '^');
  const { data } = await apiClientMainServer.delete(`/project/${payload}`);
  return data;
};

export const updateENV = async (env: any[], payload: string) => {
  console.log('sora', payload);
  const { data } = await apiClientMainServer.post(`/project/env`, {
    env,
    payload: payload.toLowerCase(),
  });
  return data;
};

export const stopServer = async (containerName: string, image: string) => {
  const { data } = await apiClientContainerServer.get(
    `/stop-server?containerName=${containerName.toLowerCase()}&&image=${image}`
  );
  return data;
};

export const startServer = async (image: string, userId: string) => {
  const { data } = await apiClientContainerServer.get(
    `/start-server?image=${image}&&userId=${userId}`
  );
  return data;
};

const getAllProjects = async () => {
  const { data } = await apiClientMainServer.get('/project');
  return data;
};

export const useAllProjects = <T>() => {
  return useQuery<T>({
    queryKey: ['allProjects'],
    queryFn: getAllProjects,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useProjectInfo = <T>(id: string) => {
  return useQuery<T>({
    queryKey: ['projectInfo', id],
    queryFn: () => getProjectInfo(id),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
