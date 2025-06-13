import { useEffect, useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { updateENV, useProjectInfo } from '@/api/project';
import { useParams } from 'react-router';
import type { Project } from '@/api/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const EnvironmentVariables = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isSensitive] = useState(false);
  const [envVars, setEnvVars] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { payload } = useParams();
  const { data: info } = useProjectInfo<{ data: Project }>(payload as string);
  const { mutate } = useMutation({
    mutationFn: ({ env, payload }: { env: any[]; payload: string }) => updateENV(env, payload),
    onSuccess: (data) => {
      console.log('env updated', data);
      toast.success(data.message || 'Environment variables updated successfully');
    },
    onError: (error) => {
      console.error('Error updating env:', error);
      toast.error(error.message || 'Failed to update environment variables');
    },
  });

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeEnvVar = (id: string) => {
    setEnvVars(envVars.filter((_, index) => index.toString() !== id));
  };

  const updateEnvVar = (id: string, field: 'key' | 'value', value: string) => {
    setEnvVars(
      envVars.map((envVar, index) =>
        index.toString() === id ? { ...envVar, [field]: value } : envVar
      )
    );
  };

  const handleSave = async () => {
    console.log('envVars', payload, envVars);

    setIsSaving(true);
    mutate({ env: envVars as any[], payload: payload as string });
    setIsSaving(false);
  };

  const handleImportEnv = () => {
    // This would typically open a file dialog
    console.log('Import .env file');
  };

  useEffect(() => {
    if (info?.data.env) {
      setEnvVars(info.data.env);
    }
  }, [info?.data.env]);

  return (
    <div className="max-w-5xl w-full mx-auto p-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <h1 className="text-center text-3xl font-semibold py-1">Create a ENV Variables</h1>
          <hr />
          <TabsContent value="create" className="mt-0 p-0">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-2">
                  <h3 className="text-sm font-medium text-zinc-400">Key</h3>
                </div>
                <div className="w-1/2 pl-2">
                  <h3 className="text-sm font-medium text-zinc-400">Value</h3>
                </div>
              </div>

              {envVars?.map((envVar, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <div className="w-1/2 pr-2">
                    <Input
                      value={envVar.key}
                      onChange={(e) => updateEnvVar(index.toString(), 'key', e.target.value)}
                      placeholder="e.g. CLIENT_KEY"
                      className="bg-zinc-950 h-12 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="w-1/2 pl-2 flex items-center gap-2">
                    <Input
                      value={envVar.value}
                      onChange={(e) => updateEnvVar(index.toString(), 'value', e.target.value)}
                      type={isSensitive ? 'password' : 'text'}
                      className="bg-zinc-950 h-12 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    ></Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnvVar(index.toString())}
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addEnvVar}
                className="mt-2 bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another
              </Button>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleImportEnv}
                  className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white mr-3"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import .env
                </Button>
                <span className="text-zinc-500 text-sm">or paste the .env contents above</span>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white text-black hover:bg-zinc-200"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnvironmentVariables;
