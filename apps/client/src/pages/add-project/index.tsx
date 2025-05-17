import { Input } from "@/components/ui/input";
import Card from "./components/card";

const AddProject = () => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <h1 className="font-semibold text-4xl text-center my-4">Import Git Repository</h1>
      <Input className="h-14" placeholder="search project...." />
      <div className="space-y-3">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default AddProject;
