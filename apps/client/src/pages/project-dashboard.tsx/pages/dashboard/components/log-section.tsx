import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LogSectionProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const LogSection = ({activeTab,setActiveTab}:LogSectionProps) => {
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
              <div className="text-green-500">● Build started</div>
              <div className="text-zinc-500">$ next build</div>
              <div className="text-zinc-400">
                info - Creating an optimized production build...
              </div>
              <div className="text-zinc-400">info - Compiled successfully</div>
              <div className="text-zinc-400">
                info - Collecting page data...
              </div>
              <div className="text-zinc-400">
                info - Generating static pages (0/10)
              </div>
              <div className="text-zinc-400">
                info - Generating static pages (5/10)
              </div>
              <div className="text-zinc-400">
                info - Generating static pages (10/10)
              </div>
              <div className="text-zinc-400">
                info - Finalizing page optimization...
              </div>
              <div className="text-green-500">
                ✓ Build completed successfully
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime-logs" className="mt-0">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <div className="font-mono text-sm text-zinc-300 h-[300px] overflow-auto p-4 bg-black rounded">
              <div className="text-zinc-400">info - Ready on port 3000</div>
              <div className="text-zinc-400">
                info - Request: GET /api/hello
              </div>
              <div className="text-zinc-400">info - Response: 200 OK</div>
              <div className="text-zinc-400">info - Request: GET /</div>
              <div className="text-zinc-400">info - Response: 200 OK</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LogSection
