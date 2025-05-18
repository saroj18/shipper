import type { RepoType } from "@/api/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Card = ({ repo }: { repo: RepoType }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border-2 bg-neutral-900 rounded-md my-3">
      <div className="flex items-center gap-4">
        <p className="font-semibold">{repo.name}</p>
        <p className="">{new Date(repo.created_at).toLocaleDateString()}</p>
        <p className="font-semibold text-neutral-400">
          {repo.private ? "Private" : "Public"}
        </p>
      </div>
      <Button
        onClick={() => navigate("/create-project/" + repo.name)}
        variant={"secondary"}
      >
        Import
      </Button>
    </div>
  );
};

export default Card;
