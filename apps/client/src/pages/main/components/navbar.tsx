import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <div className="flex gap-x-5 items-center justify-end px-5 py-4">
      <Input className="h-12 w-full max-w-xl" placeholder="search projects...." />
      <Link to={'/addproject'}>
        <Button size={'lg'}>Add New</Button>
      </Link>
    </div>
  );
};

export default Navbar;
