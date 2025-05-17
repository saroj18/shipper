"use client";

import { useState } from "react";
import { ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

const ScriptSettings = () => {
  const [framework, setFramework] = useState("other");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [outputDirectory, setOutputDirectory] = useState("dist");
  const [installCommand, setInstallCommand] = useState("npm install");
  const [developmentCommand, setDevelopmentCommand] = useState("");

  const [buildOverride, setBuildOverride] = useState(true);
  const [outputOverride, setOutputOverride] = useState(true);
  const [installOverride, setInstallOverride] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Framework Settings
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            When using a framework for a new project, it will be automatically
            detected. As a result, several project settings are automatically
            configured to achieve the best result. You can override them below.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Framework Preset
              </label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:ring-zinc-700 h-10">
                  <SelectValue>
                    <div className="flex items-center">
                      {framework === "other" && (
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center mr-2 text-xs">
                          O
                        </div>
                      )}
                      {framework === "next" && (
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mr-2 text-xs">
                          N
                        </div>
                      )}
                      {framework === "react" && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">
                          R
                        </div>
                      )}
                      {framework === "vue" && (
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mr-2 text-xs">
                          V
                        </div>
                      )}
                      {framework === "other" && "Other"}
                      {framework === "next" && "Next.js"}
                      {framework === "react" && "React"}
                      {framework === "vue" && "Vue"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300">
                  <SelectItem
                    value="other"
                    className="focus:bg-zinc-900 focus:text-white"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center mr-2 text-xs">
                        O
                      </div>
                      Other
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="next"
                    className="focus:bg-zinc-900 focus:text-white"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mr-2 text-xs">
                        N
                      </div>
                      Next.js
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="react"
                    className="focus:bg-zinc-900 focus:text-white"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs">
                        R
                      </div>
                      React
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="vue"
                    className="focus:bg-zinc-900 focus:text-white"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mr-2 text-xs">
                        V
                      </div>
                      Vue
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 items-baseline-last justify-between ">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-medium text-zinc-400">
                    Build Command
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-zinc-600" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <p className="text-xs">
                          The command that builds your project for production
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  disabled={!buildOverride}
                  className="bg-zinc-950 border-2 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Override</span>
                <Switch
                  checked={buildOverride}
                  onCheckedChange={setBuildOverride}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
            <div className="flex gap-4 items-baseline-last justify-between ">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-medium text-zinc-400">
                    Build Command
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-zinc-600" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <p className="text-xs">
                          The command that builds your project for production
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  disabled={!buildOverride}
                  className="bg-zinc-950 border-2 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Override</span>
                <Switch
                  checked={buildOverride}
                  onCheckedChange={setBuildOverride}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
            <div className="flex gap-4 items-baseline-last justify-between ">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-medium text-zinc-400">
                    Build Command
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-zinc-600" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <p className="text-xs">
                          The command that builds your project for production
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  disabled={!buildOverride}
                  className="bg-zinc-950 border-2 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Override</span>
                <Switch
                  checked={buildOverride}
                  onCheckedChange={setBuildOverride}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 px-6 py-4 flex items-center justify-end border-t border-zinc-800">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black hover:bg-zinc-200"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScriptSettings;
