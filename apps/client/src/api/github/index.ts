import { useQuery } from '@tanstack/react-query';
import type { AllRepoType, SingleRepoType } from '../types';
import { apiClientMainServer } from '..';

export const getAllRepos = async () => {
  const { data } = await apiClientMainServer.get('/github/repos');
  return data;
};

export const getSingleRepo = async (repoId: string) => {
  const { data } = await apiClientMainServer.get('/github/repo/' + repoId);
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
