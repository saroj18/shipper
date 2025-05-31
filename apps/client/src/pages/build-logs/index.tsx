import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from './components/header';
import { socket } from '@/socket';

const BuildLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    socket.on('build_logs', (data: string) => {
      console.log('>>>>>', data);
      setLogs((prv) => {
        let prvLog = [...prv];
        prvLog.push(data);
        return prvLog;
      });
    });
  }, []);
  console.log('<<<<<', logs);
  return (
    <div className="flex h-[1000px] flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-y-scroll ">
      <Header />

      <div className="bg-black text-white p-4 font-mono h-64 overflow-y-auto rounded shadow-md">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-gray-500">[{new Date(Date.now()).toLocaleTimeString()}]</span>{' '}
            <span className="text-green-400"></span>: {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildLogs;
