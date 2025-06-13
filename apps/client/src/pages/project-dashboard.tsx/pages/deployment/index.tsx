import { useState } from 'react';
import { Search, ChevronDown, GitBranch, GitCommit, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

interface Deployment {
  id: string;
  environment: string;
  status: 'ready' | 'building' | 'error' | 'canceled';
  isCurrent: boolean;
  createdAt: string;
  timeAgo: string;
  branch: string;
  commitId: string;
  commitMessage: string;
  author: string;
  authorAvatar?: string;
}

const Deployment = () => {
  const [deployments] = useState<Deployment[]>([
    {
      id: '48DFkf3VK',
      environment: 'Production',
      status: 'ready',
      isCurrent: true,
      createdAt: '2025-05-17T14:20:00Z',
      timeAgo: '35s (6h ago)',
      branch: 'main',
      commitId: '4404524',
      commitMessage: 'Merge pull request #1 from saroj18/admin',
      author: 'saroj18',
      authorAvatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: '39CRkf2TY',
      environment: 'Preview',
      status: 'ready',
      isCurrent: false,
      createdAt: '2025-05-17T12:15:00Z',
      timeAgo: '8h ago',
      branch: 'feature/login',
      commitId: '4404510',
      commitMessage: 'Add login functionality',
      author: 'saroj18',
      authorAvatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: '27BQkf1RS',
      environment: 'Development',
      status: 'error',
      isCurrent: false,
      createdAt: '2025-05-17T10:05:00Z',
      timeAgo: '10h ago',
      branch: 'fix/auth',
      commitId: '4404498',
      commitMessage: 'Fix authentication issues',
      author: 'saroj18',
      authorAvatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: '15APkf0QP',
      environment: 'Preview',
      status: 'canceled',
      isCurrent: false,
      createdAt: '2025-05-16T22:30:00Z',
      timeAgo: '22h ago',
      branch: 'feature/dashboard',
      commitId: '4404485',
      commitMessage: 'Implement dashboard UI',
      author: 'saroj18',
      authorAvatar: '/placeholder.svg?height=32&width=32',
    },
  ]);

  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-500';
      case 'building':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'canceled':
        return 'bg-zinc-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getStatusText = (status: Deployment['status']) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'building':
        return 'Building';
      case 'error':
        return 'Error';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className=" mx-auto px-10 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deployments</h1>
            <div className="flex items-center text-zinc-400 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Continuously generated from</span>
              <div className="flex items-center ml-2">
                <span className="bg-zinc-800 rounded-full w-4 h-4 flex items-center justify-center mr-1">
                  <GitBranch className="h-3 w-3" />
                </span>
                <Link to="#" className="text-blue-400 hover:underline">
                  saroj18/blog_crud
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="All Branches..."
              className="pl-9 pr-9 py-6 bg-zinc-900 border-zinc-800 rounded-md text-zinc-300 h-11"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-mono text-zinc-300">{deployment.id}</h3>
                      <div className="flex items-center">
                        <span className="text-zinc-500 text-sm">{deployment.environment}</span>
                        {deployment.isCurrent && (
                          <Badge className="ml-2 bg-blue-900 text-blue-300 hover:bg-blue-900 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(deployment.status)} mr-2`}
                        ></div>
                        <span className="text-sm">{getStatusText(deployment.status)}</span>
                      </div>
                      <span className="text-zinc-500 text-sm">{deployment.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <GitBranch className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm">{deployment.branch}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-zinc-500">{deployment.commitId}</span>
                      <span className="text-sm truncate max-w-[200px]">
                        {deployment.commitMessage}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-sm">
                        {deployment.timeAgo.split(' ')[1]} by {deployment.author}
                      </span>
                      <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                        {deployment.author.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployment;
