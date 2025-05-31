import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from './components/header';
import { socket } from '@/socket';
import { useNavigate } from 'react-router';

type BuildLogType = {
  type: string;
  message: string;
};

const BuildLogs = () => {
  const [logs, setLogs] = useState<BuildLogType[]>([]);
  const [build, setBuild] = useState<boolean>(false);

  useEffect(() => {
    setLogs([]);

    const logHandler = (data: { type: string; message: string }) => {
      setLogs((prevLogs) => [...prevLogs, data]);
    };

    socket.on('build_logs', logHandler);
    socket.on('build_status', (status: boolean) => {
      if (status) {
        setBuild(status)
      } 
    });

    return () => {
      socket.off('build_logs', logHandler);
      socket.off('build_status');
    };
  }, []);

  return (
    logs.length > 0 && (
      <div className="flex h-[1000px] flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-y-scroll ">
        <Header build={build} />

        <div className="bg-black text-white p-4 font-mono h-full overflow-y-auto rounded shadow-md">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className={`p-2 rounded `}>
                  <span className="font-bold text-white">{log.type.toUpperCase()}:</span>{' '}
                  {log.message}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  );
};

export default BuildLogs;
