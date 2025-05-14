import { Link } from 'react-router';
import Logo from './logo';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 mx-auto items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex gap-10">
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
        <div className="flex items-center gap-x-8">
          <Button
          size={'lg'}
            variant={'outline'}
            className="text-xl font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Button>
          <Button size={'lg'}>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar
