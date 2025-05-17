import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router";

interface ProjectSettingsProps {
  projectName: string;
  projectId: string;
  lastUpdated: string;
}

const ProjectSettings = ({
  projectName = "blog-crud-htg3",
  projectId = "c85bde44",
  lastUpdated = "6h ago",
}: ProjectSettingsProps) => {
  const [name, setName] = useState(projectName);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDeleting(false);
  };

  return (
    <div className="mx-auto space-y-6 w-full max-w-6xl px-16 py-8">
      <div className="bg-zinc-900 border p-4 border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-white">Project Name</h2>
        </div>
        <p className="text-zinc-400 text-sm mb-4">
          Used to identify your Project on the Dashboard, Vercel CLI, and in the
          URL of your Deployments.
        </p>

        <div className="flex w-full">
          <div className="bg-zinc-950 border-r border-zinc-800 rounded-l-md px-3 py-2 text-zinc-500 flex items-center text-sm">
            vercel.com/_js-projects-{projectId}/
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-l-none h-12 bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-zinc-700"
          />
        </div>

        <div className="bg-zinc-950 px-6 py-4 flex items-center justify-end border-t border-zinc-800">
          <Button
            onClick={handleSave}
            disabled={isSaving || name === projectName}
            className="bg-black cursor-pointer text-white "
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="bg-zinc-900 border border-red-900/20 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Delete Project
          </h2>
          <p className="text-zinc-400 text-sm mb-4">
            The project will be permanently deleted, including its deployments
            and domains. This action is irreversible and can not be undone.
          </p>

          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-4">
            <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center mr-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-500"
              >
                <path
                  d="M3 6L6 7M6 7L3 16L6 17L9 18L12 19L15 18L18 17L21 16L18 7M6 7L9 8L12 9L15 8L18 7M6 12L9 13L12 14L15 13L18 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">{projectName}</h3>
              <p className="text-zinc-500 text-sm">
                Last updated {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 px-6 py-4 flex items-center justify-end border-t border-zinc-800">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete the
                  project
                  <span className="font-semibold text-zinc-300">
                    {" "}
                    {projectName}{" "}
                  </span>
                  and all associated deployments and domains.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
