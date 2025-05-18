import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Login = () => {
  const loginHandler = async () => {
    window.location.href = import.meta.env.VITE_LOGIN_WITH_GITHUB_URL;
  };
  return (
    <div className="min-h-screen flex flex-col space-y-8 items-center py-20 ">
      <h1 className="text-white font-bold text-4xl">Log in to Shipper</h1>
      <Button
        onClick={loginHandler}
        variant={"secondary"}
        className="w-full max-w-sm py-8 text-xl"
      >
        <Github className="size-6" /> Continue with Github
      </Button>
    </div>
  );
};

export default Login;
