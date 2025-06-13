import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, Info, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { ProjectInfoType } from "..";

type EnvSectionProps = {
  projectInfo: ProjectInfoType;
  setProjectInfo: React.Dispatch<React.SetStateAction<ProjectInfoType>>;
};

const EnvSection = ({  setProjectInfo }: EnvSectionProps) => {
  const [envVarsOpen] = useState(false);
  const [envVars, setEnvVars] = useState([
    { key: "", value: "" },
  ]);
  const [envSettingsOpen, setEnvSettingsOpen] = useState(false);

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    const newVars = [...envVars];
    newVars.splice(index, 1);
    setEnvVars(newVars);
  };

  const updateEnvVar = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newVars = [...envVars];
    newVars[index][field] = value;
    setEnvVars(newVars);
  };

  useEffect(() => {
    setProjectInfo((prev) => ({
      ...prev,
      envVariables: envVars,
    }));
  }, [envVars]);

  return (
    <Collapsible
      open={envSettingsOpen}
      onOpenChange={setEnvSettingsOpen}
      className="w-full "
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full h-12 justify-start bg-[#1a1a1a] border-[#333] hover:bg-[#222] hover:text-white"
        >
          <ChevronRight
            className={`mr-2 h-4 w-4 transition-transform ${envVarsOpen ? "rotate-90" : ""}`}
          />
          Environment Variables
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-[#111] border border-[#333] border-t-0 rounded-b-md p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-400 text-sm">Key</div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            Value
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#222] border-[#333]">
                  <p>Environment variable value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {envVars.map((variable, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              value={variable.key}
              onChange={(e) => updateEnvVar(index, "key", e.target.value)}
              className="bg-[#1a1a1a] h-12 border-[#333] focus:border-gray-500 focus:ring-0"
            />
            <Input
              value={variable.value}
              onChange={(e) => updateEnvVar(index, "value", e.target.value)}
              className="bg-[#1a1a1a] h-12 border-[#333] focus:border-gray-500 focus:ring-0"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeEnvVar(index)}
              className="bg-[#1a1a1a] border-[#333] hover:bg-[#222] hover:text-white"
            >
              <Minus size={18} />
            </Button>
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={addEnvVar}
          className="mt-2 text-gray-400 hover:text-white hover:bg-transparent"
        >
          <Plus size={16} className="mr-1" />
          Add More
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EnvSection;
