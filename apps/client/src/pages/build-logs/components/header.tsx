import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
        <h2 className="text-lg font-semibold text-zinc-100">Build Logs</h2>
        <Badge
          variant="outline"
          className="ml-2 bg-zinc-800 text-zinc-400 border-zinc-700"
        >
          Live
        </Badge>
      </div>
      <Link to={'/project-dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default Header;
