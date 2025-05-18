import { Link, useNavigate } from "react-router";
import Logo from "./logo";
import { Button } from "./ui/button";
import { logoutUser } from "@/api/user";
import { useUser } from "./context";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const logOutHandler = async () => {
    await logoutUser();
    setUser(undefined);
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-white text-black">
      <div className="container flex h-20 mx-auto items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex gap-16">
            <Link
              to="#"
              className="text-lg font-black text-muted-background transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-muted-background transition-colors hover:text-foreground"
            >
              Solutions
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-muted-background transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-muted-background transition-colors hover:text-foreground"
            >
              Templates
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-muted-background transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={"/addproject"}
            className="py-3 px-10 rounded-lg font-semibold  bg-black text-white"
          >
            Get Start
          </Link>
          {user && (
            <Button onClick={logOutHandler} variant={"destructive"}>
              Log Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
