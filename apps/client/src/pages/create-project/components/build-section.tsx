import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, Info } from "lucide-react";
import { useState } from "react";
import type { ProjectInfoType } from "..";

type BuildSectionType = {
  projectInfo: ProjectInfoType;
  setProjectInfo: React.Dispatch<React.SetStateAction<ProjectInfoType>>;
};

const BuildSection = ({ projectInfo, setProjectInfo }: BuildSectionType) => {
  const [buildEnabled, setBuildEnabled] = useState(true);
  const [outputEnabled, setOutputEnabled] = useState(true);
  const [installEnabled, setInstallEnabled] = useState(true);
  const [buildSettingsOpen, setBuildSettingsOpen] = useState(false);
  const [buildCommand, setBuildCommand] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [installCommand, setInstallCommand] = useState("");

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Collapsible
      open={buildSettingsOpen}
      onOpenChange={setBuildSettingsOpen}
      className="w-full "
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="flex h-12 w-full justify-start bg-[#1a1a1a] border-[#333] hover:bg-[#222] hover:text-white"
        >
          <ChevronRight
            className={`mr-2 h-4 w-4 transition-transform ${buildSettingsOpen ? "rotate-90" : ""}`}
          />
          Build and Output Settings
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-[#111] border border-[#333] border-t-0 rounded-b-md p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="build-command" className="text-gray-400 text-sm">
              Build Command
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#222] border-[#333]">
                  <p>Command to build your project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="build-command"
              name="buildCommand"
              value={projectInfo.buildCommand}
              onChange={changeHandler}
              placeholder="`npm run vercel-build` or `npm run build`"
              className="bg-[#1a1a1a] border-[#333] focus:border-gray-500 focus:ring-0 text-gray-400"
            />
            <Switch
              checked={buildEnabled}
              onCheckedChange={setBuildEnabled}
              className="data-[state=checked]:text-blue-500 data-[state=checked]:bg-blue-500 "
            />
          </div>
        </div>

        {/* Output Directory */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="output-dir" className="text-gray-400 text-sm">
              Output Directory
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#222] border-[#333]">
                  <p>Directory where your built output is located</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="output-dir"
              name="outputDirectory"
              value={projectInfo.outputDirectory}
              onChange={changeHandler}
              placeholder="`public` if it exists, or `.`"
              className="bg-[#1a1a1a] border-[#333] focus:border-gray-500 focus:ring-0 text-gray-400"
            />
            <Switch
              checked={outputEnabled}
              onCheckedChange={setOutputEnabled}
              className="data-[state=checked]:text-blue-500 data-[state=checked]:bg-blue-500 "
            />
          </div>
        </div>

        {/* Install Command */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="output-dir" className="text-gray-400 text-sm">
              Install Command
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#222] border-[#333]">
                  <p>Command to start your project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="output-dir"
              name="startCommand"
              value={projectInfo.startCommand}
              onChange={changeHandler}
              placeholder="`npm start` or `npm run start`"
              className="bg-[#1a1a1a] border-[#333] focus:border-gray-500 focus:ring-0 text-gray-400"
            />
            <Switch
              checked={outputEnabled}
              onCheckedChange={setOutputEnabled}
              className="data-[state=checked]:text-blue-500 data-[state=checked]:bg-blue-500 "
            />
          </div>
        </div>

        {/* Install Command */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="install-command" className="text-gray-400 text-sm">
              Install Command
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#222] border-[#333]">
                  <p>Command to install dependencies</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="install-command"
              name="installCommand"
              value={projectInfo.installCommand}
              onChange={changeHandler}
              placeholder="`yarn install`, `pnpm install`, `npm install`, or `bun install`"
              className="bg-[#1a1a1a] border-[#333] focus:border-gray-500 focus:ring-0 text-gray-400"
            />
            <Switch
              checked={installEnabled}
              onCheckedChange={setInstallEnabled}
              className="  data-[state=checked]:text-blue-500 data-[state=checked]:bg-blue-500 "
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BuildSection;
