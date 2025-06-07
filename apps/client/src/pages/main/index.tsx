import { useAllProjects } from '@/api/project';
import Card from './components/card';
import Navbar from './components/navbar';
import type { Project } from '@/api/types';
import Loader from '@/components/loader';

const Main = () => {
  const { isLoading, data: projects } = useAllProjects<{ data: Project[]; isLoading: boolean }>();
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-3 gap-4 p-8">
        {isLoading ? (
          <Loader />
        ) : projects?.data.length === 0 ? (
          <div className="col-span-3 text-xl text-center text-gray-500">
            No projects found. Please create a new project.
          </div>
        ) : (
          projects?.data.map((project) => {
            return (
              <Card
                key={project.project_url}
                projectName={project.name}
                clientDomain={project.clientDomain}
                serverDomain={project.serverDomain}
                createdAt={new Date(project.createdAt).toLocaleDateString()}
                username={project.createdBy}
                status={project.serverStatus}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Main;
