import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./components/header";
import ToolBar, { type LogLevel } from "./components/tool-bar";
import { cn } from "@/lib/utils";
import { mockLogs } from "./components/constant";

const BuildLogs = () => {
  const [logs, setLogs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [activeFilters, setActiveFilters] = useState<LogLevel[]>([
    "info",
    "warning",
    "error",
    "success",
  ]);
  const [activeTab, setActiveTab] = useState("all");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = activeFilters.includes(log.level as LogLevel);

    const matchesTab = activeTab === "all" || log.source === activeTab;

    return matchesSearch && matchesLevel && matchesTab;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      <Header />

      <ToolBar
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        logs={logs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <ScrollArea className="flex-1 overflow-y-scroll" ref={scrollRef}>
        <div className="px-8 py-2">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="py-1 px-2 font-mono text-sm border-l-2 hover:bg-zinc-800/50 rounded-sm transition-colors"
                style={{
                  borderLeftColor:
                    log.level === "error"
                      ? "#ef4444"
                      : log.level === "warning"
                        ? "#eab308"
                        : log.level === "success"
                          ? "#22c55e"
                          : "#3b82f6",
                }}
              >
                <div className="flex items-start">
                  <span className="text-zinc-500 mr-2 shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-xs rounded-full mr-2 uppercase font-semibold shrink-0",
                      log.level === "error"
                        ? "bg-red-950 text-red-500"
                        : log.level === "warning"
                          ? "bg-yellow-950 text-yellow-500"
                          : log.level === "success"
                            ? "bg-green-950 text-green-500"
                            : "bg-blue-950 text-blue-500"
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="bg-zinc-800 px-1.5 py-0.5 text-xs rounded-md mr-2 text-zinc-400 shrink-0">
                    {log.source}
                  </span>
                  <span className="text-zinc-300 break-all">{log.message}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-zinc-500">
              No logs matching your filters
            </div>
          )}
          {autoScroll && <div className="h-4" />}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BuildLogs;
