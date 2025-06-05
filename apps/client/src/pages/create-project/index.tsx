import { useEffect, useState } from 'react';
import { GitBranch, GithubIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import EnvSection from './components/env.section';
import BuildLogs from '../build-logs';
import { useNavigate, useParams } from 'react-router';
import { userGithubSingleRepo } from '@/api/github';
import { useMutation } from '@tanstack/react-query';
import { deployProject } from '@/api/project';
import { socket } from '@/socket';

export type ProjectInfoType = {
  projectName: string;
  envVariables: { key: string; value: string }[];
  projectLink: string;
};

const CreateProject = () => {
  const { mutate } = useMutation({
    mutationFn: deployProject,
    onSuccess: (data) => {
      console.log('User created:', data);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
    onSettled: () => {
      const timeout = setTimeout(() => {
        setLoading(false);
        console.error('Request timed out after 60 seconds.');
      }, 60000);

      return () => clearTimeout(timeout);
    },
  });
  const [build, setBuild] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log('build', build);

  const repoName = useParams().repoName as string;
  const { data: repo } = userGithubSingleRepo(repoName);

  const [projectInfo, setProjectInfo] = useState<ProjectInfoType>({
    projectName: repoName,
    envVariables: [],
    projectLink: '',
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectInfo((prv) => {
      return {
        ...prv,
        [e.target.name]: e.target.value,
      };
    });
  };

  const clickHandler = () => {
    setLoading(true);
    mutate(projectInfo);
  };
  useEffect(() => {
    if (repo) {
      setProjectInfo((prv) => {
        return {
          ...prv,
          projectLink: repo?.data.html_url,
        };
      });
    }
  }, [repo]);

  useEffect(() => {
    socket.on('build_status', (status: boolean) => {
      setBuild(status);
      setLoading(false);
    });

    return () => {
      socket.off('build_status');
    };
  }, []);

  useEffect(() => {
    if (build) {
      const info = repo?.data.html_url.split('/');

      navigate(`/project-dashboard/${encodeURIComponent(info?.[3] + '/' + info?.[4])}`);
    }
  }, [build]);

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl text-white  bg-[#111] border-[#333] shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-white ">
            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardContent className=" text-white">
                <p className=" text-sm mb-2 text-gray-400">Importing from GitHub</p>
                <div className="flex items-center gap-x-2">
                  <GithubIcon className="text-white" />
                  <span>{repo?.data.name}</span>
                  <span className="ml-2 text-sm flex items-center gap-1">
                    <GitBranch className="text-neutral-400" size={20} />
                    {(repo?.data as any)?.default_branch}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-gray-300">
              Choose where you want to create the project and give it a name.
            </p>

            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-gray-400 text-sm">
                Project Name
              </Label>
              <Input
                id="project-name"
                name="projectName"
                value={projectInfo.projectName}
                onChange={changeHandler}
                className="bg-[#1a1a1a] h-12 border-[#333] focus:border-gray-500 focus:ring-0"
              />
            </div>

            <Separator className="bg-[#333]" />

            <EnvSection projectInfo={projectInfo} setProjectInfo={setProjectInfo} />
            <Button
              disabled={loading}
              onClick={clickHandler}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              {loading ? 'Deploying.....' : 'Deploy'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <BuildLogs projectUrl={repo?.data.html_url as string} />
    </>
  );
};

export default CreateProject;
