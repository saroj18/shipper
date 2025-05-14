import { Link } from 'react-router';
import Logo from './logo';

const Footer = () => {
  return (
    <footer className=" flex justify-between px-14 items-center bg-gray-200 text-black py-4">
          <Logo/>
          <div className="flex gap-6">
            <Link to="#" className="text-xl">
              Privacy
            </Link>
            <Link to="#" className="text-xl">
              Terms
            </Link>
            <Link to="#" className="text-xl">
              Contact
            </Link>
          </div>
          <div className="text-lg text-black">
            © 2025 MERNDeploy, Inc. All rights reserved.
          </div>
    </footer>
  );
}

export default Footer
