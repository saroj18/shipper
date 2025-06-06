import { useState } from 'react';
import { Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Header from './components/header';
import LogSection from './components/log-section';
import DeploymentInfo from './components/deployment-info';

import { startServer, stopServer, useProjectInfo } from '@/api/project';
import type { Project } from '@/api/types';
import Loader from '@/components/loader';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/main';

const ProjectDashboard = ({}) => {
  const { payload } = useParams();
  const [activeTab, setActiveTab] = useState('build-logs');
  const { data: info, isLoading } = useProjectInfo<{ data: Project; isLoading: boolean }>(
    payload as string
  );
  const { mutate, isPending: stopLoading } = useMutation({
    mutationFn: ({ containerName, image }: { containerName: string; image: string }) =>
      stopServer(containerName, image),
    onSuccess: (data) => {
      toast.success('Server stopped successfully');

      queryClient.invalidateQueries({ queryKey: ['projectInfo', payload] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to stop server');
    },
  });

  const { mutate: startMutate, isPending: startLoading } = useMutation({
    mutationFn: ({ image, userId }: { image: string; userId: string }) =>
      startServer(image, userId),
    onSuccess: (data) => {
      toast.success('Server Started successfully');

      queryClient.invalidateQueries({ queryKey: ['projectInfo', payload] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to Start server');
    },
  });

  const serverStopHandler = async (containerName: string, image: string) => {
    console.log('Stopping server for container:', containerName);
    mutate({ containerName, image });
  };
  const serverStartHandler = async (image: string, userId: string) => {
    console.log('Stopping server for container:', userId);
    startMutate({ image, userId });
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen w-full bg-black text-white px-4">
      <Header projectName={info?.data?.name as string} />
      <div className=" mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Production Deployment</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {info?.data.serverStatus == 'running' ? (
                    <Button
                      disabled={stopLoading || startLoading}
                      onClick={() =>
                        serverStopHandler(
                          `${info?.data.createdBy}-${info?.data.name}-server`,
                          info.data.serverDockerImage
                        )
                      }
                      size="icon"
                      className="bg-red-500 w-fit px-3"
                    >
                      {startLoading || stopLoading ? 'Loading..' : 'Stop Server'}
                    </Button>
                  ) : (
                    <Button
                      disabled={stopLoading || startLoading}
                      onClick={() =>
                        serverStartHandler(
                          info?.data.serverDockerImage as string,
                          info?.data.creatorId as string
                        )
                      }
                      size="icon"
                      className="bg-green-500 w-fit px-3"
                    >
                      {stopLoading || stopLoading ? 'Loading...' : 'Start Server'}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-zinc-700">
                  <p>Stop Server</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="bg-white p-4 h-[300px] flex items-center justify-center">
              <img
                src={'https://pnghq.com/wp-content/uploads/live-stream-png-full-hd-42204.png'}
                alt="Deployment Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <DeploymentInfo
            createdAt={info?.data?.createdAt as Date}
            createdBy={info?.data?.createdBy as string}
            clientDomain={
              typeof info?.data?.clientDomain === 'string' ? info.data.clientDomain : ''
            }
            serverDomain={
              typeof info?.data?.serverDomain === 'string' ? info.data.serverDomain : ''
            }
            status={info?.data.serverStatus as 'running' | 'stopped' | 'error'}
          />
        </div>

        <LogSection activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default ProjectDashboard;
