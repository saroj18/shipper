import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { socket } from '@/socket';
import { useEffect, useState } from 'react';

type LogSectionProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const LogSection = ({ activeTab, setActiveTab }: LogSectionProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    socket.on('server_logs', (data: any) => {
      setLogs((prevLogs) => [...prevLogs, data]);
      console.log('server_logs', data);
    });

    return () => {
      socket.off('server_logs');
    };
  }, []);

  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 mb-4 w-auto">
          <TabsTrigger
            value="build-logs"
            className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:text-white"
          >
            Build Logs
          </TabsTrigger>
          <TabsTrigger
            value="runtime-logs"
            className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:text-white"
          >
            Runtime Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build-logs" className="mt-0">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="font-mono text-sm text-zinc-300 h-[300px] overflow-auto p-4 bg-black rounded">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="text-zinc-400">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-zinc-400">No build logs available.</div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime-logs" className="mt-0">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="font-mono text-sm text-zinc-300 h-[300px] overflow-auto p-4 bg-black rounded">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="text-white">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-white">No build logs available.</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogSection;
