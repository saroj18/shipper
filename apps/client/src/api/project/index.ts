import type { ProjectInfoType } from '@/pages/create-project';
import { apiClient } from '..';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

export const deployProject = async (projectInfo: ProjectInfoType) => {
  const { data } = await apiClient.post('/project/deploy', projectInfo);
  return data;
};

const getProjectInfo = async (id: string) => {
  const { data } = await apiClient.get(`/project/info/?payload=${id}`);
  return data;
};

export const deleteProject = async (id: string) => {
  console.log('sora');
  const payload = id.replace('/', '^');
  const { data } = await apiClient.delete(`/project/${payload}`);
  return data;
};

export const stopServer = async (containerName: string, image: string) => {
  const { data } = await axios.get(
    `http://localhost:10000/stop-server?containerName=${containerName.toLowerCase()}&&image=${image}`
  );
  return data;
};

export const startServer = async (image: string, userId: string) => {
  const { data } = await axios.get(
    `http://localhost:10000/start-server?image=${image}&&userId=${userId}`
  );
  return data;
};

const getAllProjects = async () => {
  const { data } = await apiClient.get('/project');
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
