import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BuildLog = {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
};


export type LogLevel = "info" | "warning" | "error" | "success";

type ToolBarProps = {
  activeFilters: LogLevel[];
  setActiveFilters: (filters: LogLevel[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
    logs: BuildLog[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const ToolBar = ({
  activeFilters,
  setActiveFilters,
  searchQuery,
  setSearchQuery,
}: ToolBarProps) => {
    
  const toggleFilter = (level: LogLevel) => {
    if (activeFilters.includes(level)) {
      setActiveFilters(activeFilters.filter((l) => l !== level));
    } else {
      setActiveFilters([...activeFilters, level]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };


  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-zinc-800 bg-zinc-900">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-8 py-1 h-10 bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          >
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filter
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              activeFilters.includes("info") ? "bg-zinc-700" : ""
            )}
            onClick={() => toggleFilter("info")}
          >
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              activeFilters.includes("warning") ? "bg-zinc-700" : ""
            )}
            onClick={() => toggleFilter("warning")}
          >
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            Warning
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              activeFilters.includes("error") ? "bg-zinc-700" : ""
            )}
            onClick={() => toggleFilter("error")}
          >
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            Error
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              activeFilters.includes("success") ? "bg-zinc-700" : ""
            )}
            onClick={() => toggleFilter("success")}
          >
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Success
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
};

export default ToolBar;
