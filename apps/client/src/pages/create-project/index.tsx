import { useState } from "react";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BuildSection from "./components/build-section";
import EnvSection from "./components/env.section";
import BuildLogs from "../build-logs";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("blog-crud");
  const [rootDirectory, setRootDirectory] = useState("./");

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl text-white  bg-[#111] border-[#333] shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-white ">
            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardContent className="p-4 text-white">
                <p className=" text-sm mb-2 text-gray-400">
                  Importing from GitHub
                </p>
                <div className="flex items-center gap-2">
                  <GithubIcon className="text-white" />
                  <span>saroj18/blog_crud</span>
                  <span className="ml-2 text-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full"></div> main
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
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-[#1a1a1a] h-12 border-[#333] focus:border-gray-500 focus:ring-0"
              />
            </div>

            <Separator className="bg-[#333]" />

            <div className="space-y-2">
              <Label htmlFor="framework" className="text-gray-400 text-sm">
                Framework Preset
              </Label>
              <Select>
                <SelectTrigger className=" border-[#333] focus:ring-0 focus:border-gray-500">
                  <SelectValue placeholder="Other" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] text-white border-[#333]">
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="root-dir" className="text-gray-400 text-sm">
                Root Directory
              </Label>
              <div className="flex gap-2">
                <Input
                  id="root-dir"
                  value={rootDirectory}
                  onChange={(e) => setRootDirectory(e.target.value)}
                  className="bg-[#1a1a1a] h-12 border-[#333] focus:border-gray-500 focus:ring-0"
                />
                <Button
                  variant="outline"
                  size={"lg"}
                  className="bg-[#1a1a1a] h-12 border-[#333] hover:bg-[#222] hover:text-white"
                >
                  Edit
                </Button>
              </div>
            </div>
            <BuildSection />
            <EnvSection />
            <Button className="w-full bg-white text-black hover:bg-gray-200">
              Deploy
            </Button>
          </CardContent>
        </Card>
      </div>
      <BuildLogs />
    </>
  );
};

export default CreateProject;
