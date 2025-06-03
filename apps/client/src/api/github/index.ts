import { useQuery } from '@tanstack/react-query';
import { apiClient } from '..';
import type { AllRepoType, SingleRepoType } from '../types';

export const getAllRepos = async () => {
  const { data } = await apiClient.get('/github/repos');
  return data;
};

export const getSingleRepo = async (repoId: string) => {
  const { data } = await apiClient.get('/github/repo/' + repoId);
  return data;
};

export const userGithubAllRepos = () => {
  return useQuery<AllRepoType>({
    queryKey: ['userGithubRepos'],
    queryFn: getAllRepos,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
export const userGithubSingleRepo = (repoId: string) => {
  return useQuery<SingleRepoType>({
    queryKey: ['userGithubSingleRepo'],
    queryFn: () => getSingleRepo(repoId),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
