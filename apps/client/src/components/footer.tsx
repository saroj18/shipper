import { Link } from 'react-router';
import Logo from './logo';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-white text-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
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
        </div>
      </div>
    </footer>
  );
}

export default Footer
