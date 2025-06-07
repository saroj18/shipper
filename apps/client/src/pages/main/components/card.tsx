import {
  GitBranch,
  GithubIcon,
  Menu,
  MenuSquareIcon,
  MoreHorizontal,
  MoreVertical,
} from 'lucide-react';
import { Link } from 'react-router';

type CardProps = {
  projectName: string;
  clientDomain?: string;
  serverDomain?: string;
  createdAt: string;
  username: string;
  status: 'running' | 'stopped' | 'error';
};

const Card = ({
  projectName,
  clientDomain,
  serverDomain,
  createdAt,
  username,
  status,
}: CardProps) => {
  return (
    <Link
      to={`/project-dashboard/${encodeURIComponent(username + '/' + projectName)}`}
      className="border-2 h-fit border-neutral-500 rounded-md p-6 space-y-4 bg-neutral-950"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GithubIcon className="text-gray-500 size-10" />
          <div>
            <p className="text-lg my-1 font-semibold">{projectName}</p>
            <p>{clientDomain || serverDomain}</p>
          </div>
        </div>
        {status == 'running' ? (
          <p className="text-green-500">Running</p>
        ) : status == 'error' ? (
          <p className="text-red-500">Error</p>
        ) : (
          <p className="text-red-500">Stopped</p>
        )}
      </div>
      <div className=" bg-neutral-600 rounded-md py-1 px-2 font-semibold flex items-center gap-2">
        <GithubIcon />
        <p>{clientDomain || serverDomain}</p>
      </div>
      <div>
        <p className="font-semibold">code changes</p>
        <p className="flex items-center gap-2 my-2">
          {createdAt} <GitBranch /> main
        </p>
      </div>
    </Link>
  );
};

export default Card;
