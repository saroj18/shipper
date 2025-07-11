import { Input } from '@/components/ui/input';
import Card from './components/card';
import { userGithubAllRepos } from '@/api/github';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllProjects } from '@/api/project';
import type { Project } from '@/api/types';

const AddProject = () => {
  const { data: repos, isLoading } = userGithubAllRepos();
  const { data: projects, isLoading: loading } = useAllProjects<{
    data: Project[];
    isLoading: boolean;
  }>();
  console.log(repos);
  console.log(projects);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
  };
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <h1 className="font-semibold text-4xl text-center my-4">Import Git Repository</h1>
      <Input onChange={changeHandler} className="h-14" placeholder="search project...." />
      <div className="space-y-3 ">
        {isLoading || loading ? (
          <div className="flex flex-col space-y-4">
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
            <Skeleton className="w-full h-[80px] rounded-md bg-neutral-700" />
          </div>
        ) : (
          repos?.data
            .filter((repo) => {
              return !projects?.data.find((project) => project?.name === repo.name);
            })
            .map((repo) => {
              return repo.permissions.admin ? <Card repo={repo} key={repo.id} /> : null;
            })
        )}
      </div>
    </div>
  );
};

export default AddProject;
