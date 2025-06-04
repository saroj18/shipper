import { Outlet } from 'react-router';
import Sidebar from './components/sidebar';

const SettingLayout = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default SettingLayout;
