import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ExternalLink, GitBranch } from "lucide-react";

const Header = ({ projectName }: { projectName: string }) => {
  return (
    <header className="border-b border-zinc-800 px-6 py-4">
      <div className=" mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">{projectName}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Repository
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            Usage
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            Domains
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                Visit
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Production
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Latest Deployment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
