import { useState } from "react";
import { ExternalLink, Plus, Upload, Pencil, X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnvVar {
  key: string;
  value: string;
  id: string;
}

const EnvironmentVariables = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [isSensitive, setIsSensitive] = useState(false);
  const [environment, setEnvironment] = useState("all");
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: "", value: "", id: "1" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "", id: Date.now().toString() }]);
  };

  const removeEnvVar = (id: string) => {
    setEnvVars(envVars.filter((envVar) => envVar.id !== id));
  };

  const updateEnvVar = (id: string, field: "key" | "value", value: string) => {
    setEnvVars(
      envVars.map((envVar) =>
        envVar.id === id ? { ...envVar, [field]: value } : envVar
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleImportEnv = () => {
    // This would typically open a file dialog
    console.log("Import .env file");
  };

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

              {envVars.map((envVar) => (
                <div key={envVar.id} className="flex items-center gap-2 mb-3">
                  <div className="w-1/2 pr-2">
                    <Input
                      value={envVar.key}
                      onChange={(e) =>
                        updateEnvVar(envVar.id, "key", e.target.value)
                      }
                      placeholder="e.g. CLIENT_KEY"
                      className="bg-zinc-950 h-12 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="w-1/2 pl-2 flex items-center gap-2">
                    <Input
                      value={envVar.value}
                      onChange={(e) =>
                        updateEnvVar(envVar.id, "value", e.target.value)
                      }
                      type={isSensitive ? "password" : "text"}
                      className="bg-zinc-950 h-12 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnvVar(envVar.id)}
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
                <span className="text-zinc-500 text-sm">
                  or paste the .env contents above
                </span>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white text-black hover:bg-zinc-200"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnvironmentVariables;
