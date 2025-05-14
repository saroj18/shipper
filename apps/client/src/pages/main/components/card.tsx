import { GitBranch, GithubIcon, Menu,  } from "lucide-react";

const Card = () => {
  return (
    <div className="border-2 h-fit border-neutral-500 rounded-md p-6 space-y-4 bg-neutral-950">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GithubIcon className="text-gray-500 size-10" />
          <div>
            <p className="text-lg font-semibold">blog-crud-app</p>
            <p>blog-crud-app.shipper.com</p>
          </div>
        </div>
        <Menu />
      </div>
      <div className=" bg-neutral-600 rounded-md py-1 px-2 font-semibold flex items-center gap-2">
        <GithubIcon />
        <p>saroj018/blog-crud-app</p>
      </div>
      <div>
        <p className="font-semibold">code changes</p>
        <p className="flex items-center gap-2">
          jan 15 on <GitBranch /> main
        </p>
      </div>
    </div>
  );
};

export default Card;
