import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <SidebarDashboard />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;