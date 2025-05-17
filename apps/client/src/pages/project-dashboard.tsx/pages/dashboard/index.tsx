import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from "./components/header";
import LogSection from "./components/log-section";
import DeploymentInfo from "./components/deployment-info";
import Navbar from "./components/navbar";

interface DeploymentDashboardProps {
  projectName: string;
  deploymentUrl: string;
  domain: string;
  createdAt: string;
  createdBy: string;
  branch: string;
  commitMessage: string;
  commitId: string;
  status: "ready" | "building" | "error";
  previewUrl?: string;
}

const ProjectDashboard = ({
  projectName = "blog-crud-htg3",
  deploymentUrl = "blog-crud-htg3-3pym21hp3-sarojs-projects-c85bde44.vercel.app",
  domain = "blog-crud-htg3.vercel.app",
  createdAt = "2h ago",
  createdBy = "saroj18",
  branch = "main",
  commitMessage = "Merge pull request #1 from saroj18/admin",
  commitId = "4404524",
  status = "ready",
  previewUrl = "/placeholder.svg?height=400&width=600",
}: DeploymentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("build-logs");

  return (
    <div className="min-h-screen w-full bg-black text-white px-4">
      <Header projectName={projectName} />
      <div className=" mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Production Deployment</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-zinc-700">
                  <p>Instant Rollback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="bg-white p-4 h-[300px] flex items-center justify-center">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Deployment Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <DeploymentInfo
            branch={branch}
            commitId={commitId}
            commitMessage={commitMessage}
            createdAt={createdAt}
            createdBy={createdBy}
            deploymentUrl={deploymentUrl}
            domain={domain}
            status={status}
          />
        </div>

        <LogSection activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default ProjectDashboard;
