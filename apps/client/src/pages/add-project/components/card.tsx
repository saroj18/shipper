import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export type RepoType = {
  id: string;
  name: string;
  created_at: string;
  createdBy: string;
  branch: string;
  commitId: string;
  owner: any;
};

const Card = ({repo}:{repo:RepoType}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border-2 bg-neutral-900 rounded-md my-3">
      <div className="flex items-center gap-4">
        <p className="font-semibold">{repo.name}</p>
        <p className="font-semibold">{repo.owner.login}</p>
        <p className="text-neutral-400">{new Date(repo.created_at).toLocaleDateString()}</p>
      </div>
      <Button onClick={() => navigate("/create-project/"+repo.id)} variant={"secondary"}>
        Import
      </Button>
    </div>
  );
}

export default Card
