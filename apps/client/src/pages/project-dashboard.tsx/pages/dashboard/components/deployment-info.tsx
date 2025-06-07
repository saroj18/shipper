import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Clock, Copy, ExternalLink } from 'lucide-react';

type DeploymentInfoProps = {
  clientDomain: string;
  serverDomain: string;
  createdAt: Date;
  createdBy: string;
  status: 'running' | 'stopped' | 'error';
};

const DeploymentInfo = ({
  clientDomain,
  serverDomain,
  createdAt,
  createdBy,
  status,
}: DeploymentInfoProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text + `${import.meta.env.VITE_DOMAIN}`);
  };
  return (
    <div className="lg:col-span-2 bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-2">Deployment</h3>
        {status == 'error' ? (
          <p className="text-red-500">Error</p>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-zinc-300 break-all">
              {clientDomain || serverDomain}
              {import.meta.env.VITE_DOMAIN}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(clientDomain || serverDomain)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-zinc-700">
                  <p>Copy URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {clientDomain && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Client Domain</h3>
          {status == 'error' ? (
            <p className="text-red-500">Error</p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-300">
                {clientDomain + `${import.meta.env.VITE_DOMAIN}`}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(clientDomain)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-zinc-700">
                    <p>Copy domain</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ExternalLink
                onClick={() =>
                  window.open('http://' + clientDomain + import.meta.env.VITE_DOMAIN, '_blank')
                }
                className="h-3.5 w-3.5 text-zinc-500 cursor-pointer hover:text-zinc-300"
              />
            </div>
          )}
        </div>
      )}
      {serverDomain && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Server Domain</h3>
          {status == 'error' ? (
            <p className="text-red-500">Error</p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-300">
                {serverDomain + `${import.meta.env.VITE_DOMAIN}`}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(serverDomain)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-zinc-700">
                    <p>Copy domain</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ExternalLink
                onClick={() =>
                  window.open('http://' + serverDomain + import.meta.env.VITE_DOMAIN, '_blank')
                }
                className="h-3.5 w-3.5 text-zinc-500 cursor-pointer hover:text-zinc-300"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Status</h3>
          <div className="flex items-center gap-2">
            {status === 'running' && (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Running</span>
              </>
            )}
            {status === 'stopped' && (
              <>
                <span className="text-sm text-red-500">Stopped</span>
              </>
            )}
            {status === 'error' && (
              <>
                <span className="text-sm  text-red-500">Error</span>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Created</h3>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">
              {new Date(createdAt).toLocaleDateString()} by {createdBy}
            </span>
            <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
              {createdBy.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-2">Source</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">{branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">{commitId}</span>
            <span className="text-sm">{commitMessage}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DeploymentInfo;
